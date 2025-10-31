/**
 * Sentiment Analysis API
 * - Detect positive / negative / neutral sentiment
 * - Extract keywords
 * - Extract basic emotions (joy, sadness, anger, fear, surprise, disgust, anticipation)
 * - Batch processing and optional HuggingFace provider integration
 *
 * @author Useful-APIs Contributors
 * @version 1.0.0
 *
 * Usage:
 *   const res = await analyzeSentiment("I love this product!");
 *   const emo = await analyzeEmotions("I am so happy and excited!");
 *   const keywords = extractKeywords("This is a review about product quality and price.");
 *
 * Notes:
 * - Default uses a small local lexicon (no deps).
 * - For higher accuracy you may provide options.hfApiKey and options.hfModel to call HuggingFace Inference API.
 */

const DEFAULT_MAX_KEYWORDS = 8;

/* --- Lightweight lexicons & stopwords --- */
const AFINN_LITE = {
  love: 3, like: 2, excellent: 3, amazing: 3, awesome: 3, great: 3, good: 2, happy: 3, pleased: 2, satisfied: 2,
  bad: -2, terrible: -3, awful: -3, hate: -3, poor: -2, disappointed: -2, unhappy: -2, angry: -3, frustrated: -2,
  ok: 0, neutral: 0
};

const EMOTION_LEXICON = {
  joy: new Set(['happy','joy','delight','excited','thrilled','love','pleased','satisfied','smile']),
  sadness: new Set(['sad','sadness','unhappy','depressed','sorrow','disappointed','mourn']),
  anger: new Set(['angry','anger','mad','furious','annoyed','hate','irritated']),
  fear: new Set(['fear','scared','afraid','anxious','worried','panic']),
  surprise: new Set(['surprise','surprised','astonished','shocked','wow']),
  disgust: new Set(['disgust','disgusted','gross','nasty','repulsed']),
  anticipation: new Set(['anticipate','anticipation','expect','looking forward'])
};

const STOPWORDS = new Set([
  'the','is','in','at','of','and','a','an','to','for','with','on','this','that','it','as','are','was','be','by','from','or','but','if','they','their','i','you','we','he','she','them','my','your'
]);

/* --- Helpers --- */
function _normalize(text = '') {
  return String(text).toLowerCase()
    .replace(/[\u2018\u2019\u201C\u201D]/g, "'")
    .replace(/[^a-z0-9'\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function _tokens(text = '') {
  const n = _normalize(text);
  if (!n) return [];
  return n.split(' ').filter(Boolean);
}
function _unique(arr) { return Array.from(new Set(arr)); }

/* --- Local sentiment analyzer (simple AFINN-lite) --- */
function _localSentiment(text) {
  const tokens = _tokens(text);
  let score = 0;
  const positive = [];
  const negative = [];

  for (const t of tokens) {
    const s = AFINN_LITE[t];
    if (typeof s === 'number') {
      score += s;
      if (s > 0) positive.push(t);
      if (s < 0) negative.push(t);
    }
  }

  const comparative = tokens.length ? score / tokens.length : 0;
  let label = 'neutral';
  if (score >= 2 || comparative >= 0.5) label = 'positive';
  else if (score <= -2 || comparative <= -0.5) label = 'negative';

  return { provider: 'local', score, comparative, label, positive: _unique(positive), negative: _unique(negative) };
}

/* --- Local emotion extraction --- */
function _localEmotions(text) {
  const tokens = _tokens(text);
  const counts = {};
  for (const k of Object.keys(EMOTION_LEXICON)) counts[k] = 0;
  for (const t of tokens) {
    for (const [emo, lex] of Object.entries(EMOTION_LEXICON)) {
      if (lex.has(t)) counts[emo]++;
    }
  }
  const dominant = Object.entries(counts).reduce((a,b) => b[1] > a[1] ? b : a, ['',0])[0] || null;
  return { provider: 'local', counts, dominantEmotion: dominant };
}

/* --- Keyword extraction (frequency) --- */
function _localKeywords(text, max = DEFAULT_MAX_KEYWORDS) {
  const tokens = _tokens(text).filter(t => !STOPWORDS.has(t) && t.length > 2);
  const freq = Object.create(null);
  for (const t of tokens) freq[t] = (freq[t] || 0) + 1;
  const items = Object.entries(freq).sort((a,b) => b[1]-a[1]).map(([k,v]) => ({ keyword: k, count: v }));
  return items.slice(0, Number(max) || DEFAULT_MAX_KEYWORDS);
}

/* --- Optional HuggingFace inference call --- */
async function _hfInfer(text, hfApiKey, model) {
  if (!hfApiKey) throw new Error('hfApiKey required for HuggingFace provider');
  const url = `https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${hfApiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputs: text, options: { wait_for_model: true } })
  });
  if (!res.ok) {
    const t = await res.text().catch(()=>'');
    throw new Error(`HuggingFace inference error ${res.status}: ${t}`);
  }
  return res.json();
}

/* --- Public API --- */

/**
 * Analyze sentiment for a single text.
 * options:
 *  - provider: 'local'|'hf' (default 'local' unless hfApiKey provided)
 *  - hfApiKey, hfModel
 */
async function analyzeSentiment(text, options = {}) {
  try {
    if (typeof text !== 'string') throw new Error('text must be a string');
    const provider = options.provider || (options.hfApiKey ? 'hf' : 'local');

    if (provider === 'hf') {
      const model = options.hfModel || 'cardiffnlp/twitter-roberta-base-sentiment';
      const data = await _hfInfer(text, options.hfApiKey, model);
      // Normalize common HF output shapes
      if (Array.isArray(data) && data.length) {
        const best = data.sort((a,b)=> (b.score||0)-(a.score||0))[0];
        const lab = String(best.label||'').toLowerCase();
        let label = 'neutral';
        if (lab.includes('pos')) label = 'positive';
        else if (lab.includes('neg')) label = 'negative';
        return { provider: 'hf', raw: data, label, score: best.score || 0 };
      }
      return { provider: 'hf', raw: data, label: 'neutral', score: 0 };
    }

    return _localSentiment(text);
  } catch (err) {
    console.error('analyzeSentiment error:', err);
    throw err;
  }
}

/**
 * Extract keywords from text.
 * options:
 *  - max: number of keywords
 *  - includeCounts: boolean (default true)
 */
function extractKeywords(text, options = {}) {
  if (typeof text !== 'string') throw new Error('text must be a string');
  const kws = _localKeywords(text, options.max);
  return options.includeCounts === false ? kws.map(k=>k.keyword) : kws;
}

/**
 * Analyze emotions present in text.
 * options:
 *  - provider: 'local'|'hf'
 *  - hfApiKey, hfModel (when provider='hf')
 */
async function analyzeEmotions(text, options = {}) {
  try {
    if (typeof text !== 'string') throw new Error('text must be a string');
    const provider = options.provider || (options.hfApiKey ? 'hf' : 'local');

    if (provider === 'hf') {
      const model = options.hfModel || 'j-hartmann/emotion-english-distilroberta-base';
      const data = await _hfInfer(text, options.hfApiKey, model);
      return { provider: 'hf', raw: data };
    }

    return _localEmotions(text);
  } catch (err) {
    console.error('analyzeEmotions error:', err);
    throw err;
  }
}

/**
 * Combined analysis: sentiment + keywords + emotions
 * options passed to subcalls
 */
async function analyzeText(text, options = {}) {
  const [sent, emo] = await Promise.all([
    analyzeSentiment(text, options),
    analyzeEmotions(text, options)
  ]);
  const keywords = extractKeywords(text, options);
  return { sentiment: sent, emotions: emo, keywords };
}

/**
 * Batch analyze array of texts.
 * Returns array of { input, sentiment, emotions, keywords }
 */
async function analyzeBatch(texts = [], options = {}) {
  if (!Array.isArray(texts)) throw new Error('texts must be an array');
  const out = [];
  for (const t of texts) {
    const res = await analyzeText(t, options);
    out.push({ input: t, ...res });
  }
  return out;
}

/**
 * List supported local emotions
 */
function getSupportedEmotions() {
  return Object.keys(EMOTION_LEXICON);
}

/* Export for Node.js */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    analyzeSentiment,
    extractKeywords,
    analyzeEmotions,
    analyzeText,
    analyzeBatch,
    getSupportedEmotions
  };
}

/* Expose for browser usage */
if (typeof window !== 'undefined') {
  window.SentimentAPI = {
    analyzeSentiment,
    extractKeywords,
    analyzeEmotions,
    analyzeText,
    analyzeBatch,
    getSupportedEmotions
  };
}
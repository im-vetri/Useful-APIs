# Sentiment Analysis API

Lightweight Sentiment & Emotion analysis helpers. Detect positive / negative / neutral sentiment, extract keywords, and identify basic emotions (joy, sadness, anger, fear, surprise, disgust, anticipation). Supports local lexicon-based analysis (no dependencies) and optional HuggingFace Inference integration for higher accuracy.

## Quick Start

### Browser
```html
<script src="sentimentAnalysis.js"></script>

<script>
  // Analyze sentiment (returns promise)
  SentimentAPI.analyzeSentiment('I love this product!')
    .then(result => console.log(result))
    .catch(err => console.error(err));

  // Extract keywords
  const kws = SentimentAPI.extractKeywords('Great product, fast shipping, excellent support', { max: 5 });
  console.log(kws);
</script>
```

### Node.js
```javascript
const SentimentAPI = require('./sentimentAnalysis.js');

(async () => {
  const s = await SentimentAPI.analyzeSentiment('This is terrible and overpriced.');
  console.log(s);

  const emo = await SentimentAPI.analyzeEmotions('I am so happy and excited about this!');
  console.log(emo);

  const keywords = SentimentAPI.extractKeywords('Nice quality, good price, fast delivery', { includeCounts: true });
  console.log(keywords);
})();
```

## API Functions

| Function | Parameters | Description |
|----------|------------|-------------|
| `analyzeSentiment(text, options)` | `text` (string), `options` (object) | Detects sentiment: returns label (positive/neutral/negative), score, provider info. `options.provider` = 'local' or 'hf' (HuggingFace). |
| `analyzeEmotions(text, options)` | `text` (string), `options` (object) | Extracts emotion counts & dominant emotion. Supports local lexicon or HF emotion models. |
| `extractKeywords(text, options)` | `text` (string), `options` (max, includeCounts)` | Returns top keywords by frequency (default max 8). |
| `analyzeText(text, options)` | `text` (string), `options` (object) | Combined analysis: sentiment + emotions + keywords. |
| `analyzeBatch(texts, options)` | `texts` (array), `options` | Batch process multiple texts; returns array of analyses. |
| `getSupportedEmotions()` | None | Returns list of locally supported emotions. |

## Response Format

- analyzeSentiment (local example):
```json
{
  "provider": "local",
  "score": 3,
  "comparative": 0.6,
  "label": "positive",
  "positive": ["love","great"],
  "negative": []
}
```

- analyzeEmotions (local example):
```json
{
  "provider": "local",
  "counts": { "joy": 2, "sadness": 0, "anger": 0, "fear": 0, "surprise": 0, "disgust": 0, "anticipation": 0 },
  "dominantEmotion": "joy"
}
```

- extractKeywords:
```json
[
  { "keyword": "product", "count": 2 },
  { "keyword": "price", "count": 1 }
]
```

- analyzeText combined:
```json
{
  "sentiment": { /* sentiment object */ },
  "emotions": { /* emotions object */ },
  "keywords": [ /* keywords array */ ]
}
```

## Error Handling

All functions return rejected promises (or throw synchronously for invalid input) with descriptive errors.

```javascript
SentimentAPI.analyzeSentiment(null)
  .catch(err => console.error('Error:', err.message));
```

## Examples

### Simple sentiment
```javascript
const r = await SentimentAPI.analyzeSentiment('I hated the service and the product was broken.');
console.log(r.label); // 'negative'
```

### Use HuggingFace for higher accuracy
```javascript
const res = await SentimentAPI.analyzeSentiment('Amazing experience!', {
  provider: 'hf',
  hfApiKey: process.env.HF_KEY,
  hfModel: 'cardiffnlp/twitter-roberta-base-sentiment'
});
console.log(res);
```

### Batch analyze social posts
```javascript
const posts = ['Loved it!', 'Not great, overpriced', 'Okay experience'];
const out = await SentimentAPI.analyzeBatch(posts);
console.table(out.map(o => ({ text: o.input, sentiment: o.sentiment.label })));
```

## Notes

- Local analysis is fast and dependency-free but basic. For production, provide a HuggingFace API key and model via options for improved accuracy.
- Stopwords and lexicons are English-focused; results may vary for other languages.
- Respect HuggingFace API rate limits when using the HF provider.

## License

MIT
```// filepath: /Users/mananbansal/Desktop/Cloning Thing/Useful-APIs/apis/sentimentAnalysis/README.md
# Sentiment Analysis API

Lightweight Sentiment & Emotion analysis helpers. Detect positive / negative / neutral sentiment, extract keywords, and identify basic emotions (joy, sadness, anger, fear, surprise, disgust, anticipation). Supports local lexicon-based analysis (no dependencies) and optional HuggingFace Inference integration for higher accuracy.

## Quick Start

### Browser
```html
<script src="sentimentAnalysis.js"></script>

<script>
  // Analyze sentiment (returns promise)
  SentimentAPI.analyzeSentiment('I love this product!')
    .then(result => console.log(result))
    .catch(err => console.error(err));

  // Extract keywords
  const kws = SentimentAPI.extractKeywords('Great product, fast shipping, excellent support', { max: 5 });
  console.log(kws);
</script>
```

### Node.js
```javascript
const SentimentAPI = require('./sentimentAnalysis.js');

(async () => {
  const s = await SentimentAPI.analyzeSentiment('This is terrible and overpriced.');
  console.log(s);

  const emo = await SentimentAPI.analyzeEmotions('I am so happy and excited about this!');
  console.log(emo);

  const keywords = SentimentAPI.extractKeywords('Nice quality, good price, fast delivery', { includeCounts: true });
  console.log(keywords);
})();
```

## API Functions

| Function | Parameters | Description |
|----------|------------|-------------|
| `analyzeSentiment(text, options)` | `text` (string), `options` (object) | Detects sentiment: returns label (positive/neutral/negative), score, provider info. `options.provider` = 'local' or 'hf' (HuggingFace). |
| `analyzeEmotions(text, options)` | `text` (string), `options` (object) | Extracts emotion counts & dominant emotion. Supports local lexicon or HF emotion models. |
| `extractKeywords(text, options)` | `text` (string), `options` (max, includeCounts)` | Returns top keywords by frequency (default max 8). |
| `analyzeText(text, options)` | `text` (string), `options` (object) | Combined analysis: sentiment + emotions + keywords. |
| `analyzeBatch(texts, options)` | `texts` (array), `options` | Batch process multiple texts; returns array of analyses. |
| `getSupportedEmotions()` | None | Returns list of locally supported emotions. |

## Response Format

- analyzeSentiment (local example):
```json
{
  "provider": "local",
  "score": 3,
  "comparative": 0.6,
  "label": "positive",
  "positive": ["love","great"],
  "negative": []
}
```

- analyzeEmotions (local example):
```json
{
  "provider": "local",
  "counts": { "joy": 2, "sadness": 0, "anger": 0, "fear": 0, "surprise": 0, "disgust": 0, "anticipation": 0 },
  "dominantEmotion": "joy"
}
```

- extractKeywords:
```json
[
  { "keyword": "product", "count": 2 },
  { "keyword": "price", "count": 1 }
]
```

- analyzeText combined:
```json
{
  "sentiment": { /* sentiment object */ },
  "emotions": { /* emotions object */ },
  "keywords": [ /* keywords array */ ]
}
```

## Error Handling

All functions return rejected promises (or throw synchronously for invalid input) with descriptive errors.

```javascript
SentimentAPI.analyzeSentiment(null)
  .catch(err => console.error('Error:', err.message));
```

## Examples

### Simple sentiment
```javascript
const r = await SentimentAPI.analyzeSentiment('I hated the service and the product was broken.');
console.log(r.label); // 'negative'
```

### Use HuggingFace for higher accuracy
```javascript
const res = await SentimentAPI.analyzeSentiment('Amazing experience!', {
  provider: 'hf',
  hfApiKey: process.env.HF_KEY,
  hfModel: 'cardiffnlp/twitter-roberta-base-sentiment'
});
console.log(res);
```

### Batch analyze social posts
```javascript
const posts = ['Loved it!', 'Not great, overpriced', 'Okay experience'];
const out = await SentimentAPI.analyzeBatch(posts);
console.table(out.map(o => ({ text: o.input, sentiment: o.sentiment.label })));
```

## Notes

- Local analysis is fast and dependency-free but basic. For production, provide a HuggingFace API key and model via options for improved accuracy.
- Stopwords and lexicons are English-focused; results may vary for other languages.
- Respect HuggingFace API rate limits when using the HF provider.

## License

MIT
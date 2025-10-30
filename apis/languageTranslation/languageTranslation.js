/**
 * Language Translation API
 * Translates text between languages using LibreTranslate API
 * Supports multiple language pairs and batch translation
 * 
 * @author Useful-APIs Contributors
 * @version 1.0.0
 */

const BASE_URL = "https://libretranslate.com/";

// Supported language codes
const LANGUAGES = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ru: "Russian",
    ja: "Japanese",
    ko: "Korean",
    zh: "Chinese",
    ar: "Arabic",
    hi: "Hindi"
};

/**
 * Helper function to make API requests
 * @private
 */
async function fetchTranslationAPI(endpoint, options = {}) {
    const url = BASE_URL + endpoint;
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
        }
        
        return response.json();
    } catch (error) {
        throw new Error(`Translation request failed: ${error.message}`);
    }
}

/**
 * Get list of supported languages
 * @returns {Promise<Array>} Array of language objects with code and name
 */
async function getSupportedLanguages() {
    return fetchTranslationAPI('languages');
}

/**
 * Translate text from one language to another
 * @param {string} text - Text to translate
 * @param {string} source - Source language code
 * @param {string} target - Target language code
 * @returns {Promise<Object>} Translation result with detected language
 */
async function translateText(text, source, target) {
    if (!text || !target) {
        throw new Error('Text and target language are required');
    }

    const payload = {
        q: text,
        source: source || 'auto',
        target: target
    };

    return fetchTranslationAPI('translate', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

/**
 * Batch translate multiple texts
 * @param {Array<string>} texts - Array of texts to translate
 * @param {string} source - Source language code
 * @param {string} target - Target language code
 * @returns {Promise<Array>} Array of translation results
 */
async function batchTranslate(texts, source, target) {
    if (!Array.isArray(texts)) {
        throw new Error('Texts must be an array');
    }

    return Promise.all(texts.map(text => translateText(text, source, target)));
}

/**
 * Detect language of text
 * @param {string} text - Text to analyze
 * @returns {Promise<Object>} Detected language info
 */
async function detectLanguage(text) {
    if (!text) {
        throw new Error('Text is required');
    }

    return fetchTranslationAPI('detect', {
        method: 'POST',
        body: JSON.stringify({ q: text })
    });
}

/**
 * Get supported language pairs
 * @returns {Array} Array of supported language pair objects
 */
function getSupportedLanguagePairs() {
    const pairs = [];
    const codes = Object.keys(LANGUAGES);
    
    codes.forEach(source => {
        codes.forEach(target => {
            if (source !== target) {
                pairs.push({
                    source: {
                        code: source,
                        name: LANGUAGES[source]
                    },
                    target: {
                        code: target,
                        name: LANGUAGES[target]
                    }
                });
            }
        });
    });
    
    return pairs;
}

/* Export for Node.js */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        translateText,
        batchTranslate,
        detectLanguage,
        getSupportedLanguages,
        getSupportedLanguagePairs,
        LANGUAGES
    };
}

/* Expose to window for browser usage */
if (typeof window !== 'undefined') {
    window.TranslationAPI = {
        translateText,
        batchTranslate, 
        detectLanguage,
        getSupportedLanguages,
        getSupportedLanguagePairs,
        LANGUAGES
    };
}
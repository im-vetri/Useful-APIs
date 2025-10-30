# Language Translation API

A lightweight wrapper around LibreTranslate API for translating text between multiple languages. Supports language detection, batch translation, and multiple language pairs.

## Quick Start

### Browser
```html
<script src="languageTranslation.js"></script>
<script>
  // Translate text
  TranslationAPI.translateText('Hello world', 'en', 'es')
    .then(result => console.log(result.translatedText))
    .catch(error => console.error(error));

  // Detect language
  TranslationAPI.detectLanguage('Bonjour le monde')
    .then(result => console.log(result.language))
    .catch(error => console.error(error));
</script>
```

### Node.js
```javascript
const TranslationAPI = require('./languageTranslation.js');

// Translate text
TranslationAPI.translateText('Hello world', 'en', 'es')
  .then(result => console.log(result.translatedText))
  .catch(error => console.error(error));

// Batch translate
const texts = ['Hello', 'World'];
TranslationAPI.batchTranslate(texts, 'en', 'fr')
  .then(results => console.log(results))
  .catch(error => console.error(error));
```

## API Functions

| Function | Parameters | Description |
|----------|-----------|-------------|
| `translateText(text, source, target)` | text (string), source (string), target (string) | Translate single text between languages |
| `batchTranslate(texts, source, target)` | texts (Array<string>), source (string), target (string) | Translate multiple texts in one request |
| `detectLanguage(text)` | text (string) | Detect language of input text |
| `getSupportedLanguages()` | None | Get list of supported languages |
| `getSupportedLanguagePairs()` | None | Get all possible language pairs |

## Response Formats

Translation result:
```javascript
{
  translatedText: "Hola mundo",
  source: "en",
  target: "es"
}
```

Language detection:
```javascript
{
  language: "fr",
  confidence: 0.92
}
```

## Supported Languages

The API supports translation between the following languages:
- English (en)
- Spanish (es) 
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Russian (ru)
- Japanese (ja)
- Korean (ko)
- Chinese (zh)
- Arabic (ar)
- Hindi (hi)

## Error Handling

All functions return rejected promises on error with descriptive messages:

```javascript
TranslationAPI.translateText('Hello', 'invalid', 'es')
  .catch(error => console.error('Error:', error.message));
```

## Rate Limits & Usage

- LibreTranslate has rate limits - check their documentation for current limits
- For production use consider:
  - Self-hosting LibreTranslate
  - Using a paid API key
  - Switching to a commercial translation API

## License

MIT
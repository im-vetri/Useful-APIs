# URL Shortener API

Shorten long URLs instantly using TinyURL. Validate URLs, get URL info, and batch process multiple links.

## Quick Start

### Browser
```html
<script src="urlShortener.js"></script>

<script>
  // Shorten a URL
  urlShortenerAPI.shortenURL('https://www.example.com/very/long/url/path')
    .then(result => {
      console.log(result.shortUrl); // https://tinyurl.com/xxxx
    })
    .catch(error => console.error(error));
</script>
```

### Node.js
```javascript
const { shortenURL, isValidURL } = require('./urlShortener.js');

// Shorten URL
const result = await shortenURL('https://github.com/Vetri-78640/Useful-APIs');
console.log(result.shortUrl);
```

## API Functions

| Function | Description |
|----------|-------------|
| `shortenURL(url)` | Shorten a single URL |
| `shortenMultipleURLs(array)` | Shorten multiple URLs |
| `isValidURL(url)` | Validate URL format |
| `getURLInfo(url)` | Get URL components |
| `extractDomain(url)` | Extract domain name |
| `getURLStatistics(array)` | Get statistics about URLs |

## Examples

### Shorten URL
```javascript
const result = await urlShortenerAPI.shortenURL('https://example.com');
// Returns: { originalUrl, shortUrl, timestamp }
```

### Validate URL
```javascript
console.log(urlShortenerAPI.isValidURL('https://example.com')); // true
```

## License

MIT

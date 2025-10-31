# Quote Generator API

Generate random motivational quotes for inspiration, testing, or fun.

## Quick Start

### Browser
```html
<script src="quoteGenerator.js"></script>

<script>
  // Generate a random quote
  const quote = await quoteAPI.getRandomQuote();
  document.body.innerHTML = `<h3>"${quote.text}" — ${quote.author}</h3>`;
</script>
```

### Node.js
```javascript
const { getRandomQuote, searchQuotes } = require('./quoteGenerator.js');

// Get a random quote
const quote = await getRandomQuote();
console.log(`"${quote.text}" — ${quote.author}`);

// Search quotes by keyword
const results = await searchQuotes('success');
console.log(results);
```

## API Functions

| Function | Description |
|----------|-------------|
| `getRandomQuote()` | Get a random motivational quote |
| `searchQuotes(keyword)` | Search quotes by keyword or author |

## Example Quotes

```json
[
  { "text": "The best way to get started is to quit talking and begin doing.", "author": "Walt Disney" },
  { "text": "Don’t let yesterday take up too much of today.", "author": "Will Rogers" },
  { "text": "It’s not whether you get knocked down, it’s whether you get up.", "author": "Vince Lombardi" },
  { "text": "If you are working on something exciting, it will keep you motivated.", "author": "Steve Jobs" },
  { "text": "Success is not in what you have, but who you are.", "author": "Bo Bennett" }
]
```

## Examples

### Random Quote
```javascript
const quote = await quoteAPI.getRandomQuote();
console.log(`"${quote.text}" — ${quote.author}`);
```

### Search by Keyword
```javascript
const results = await quoteAPI.searchQuotes('motivation');
console.log(results);
```

## Works In

- ✅ Node.js  
- ✅ Browser (ES Modules)  

## License

MIT

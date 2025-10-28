# Stock Market API

Real-time stock quotes, company information, and portfolio calculations. Uses Finnhub API (requires free API key).

## Quick Start

### Get Free API Key
Visit [finnhub.io](https://finnhub.io) to get your free API key.

### Browser
```html
<script src="stockMarket.js"></script>

<script>
  const apiKey = 'YOUR_FINNHUB_API_KEY';
  
  // Get stock quote
  stockMarketAPI.getStockQuote('AAPL', apiKey)
    .then(quote => {
      console.log(`AAPL: $${quote.current}`);
      console.log(`Change: ${quote.change} (${quote.changePercent}%)`);
    })
    .catch(error => console.error(error));
</script>
```

### Node.js
```javascript
const { getStockQuote, calculateProfit } = require('./stockMarket.js');

const apiKey = 'YOUR_FINNHUB_API_KEY';

// Get quote
const quote = await getStockQuote('AAPL', apiKey);
console.log(`Current price: $${quote.current}`);
```

## API Functions

| Function | Description |
|----------|-------------|
| `getStockQuote(symbol, apiKey)` | Get current stock price |
| `getCompanyProfile(symbol, apiKey)` | Get company information |
| `calculateProfit(buyPrice, currentPrice, shares)` | Calculate P&L |
| `getPopularSymbols()` | Get common stock symbols |
| `isValidSymbol(symbol)` | Validate stock ticker |
| `calculatePortfolioValue(holdings, prices)` | Portfolio value |

## Examples

### Get Stock Quote
```javascript
const quote = await stockMarketAPI.getStockQuote('MSFT', apiKey);
console.log(`MSFT: $${quote.current}`);
```

### Calculate Profit
```javascript
const result = stockMarketAPI.calculateProfit(150, 175, 10);
// Bought 10 shares at $150, now worth $175
// Profit: $250 (+16.67%)
```

## Popular Symbols

AAPL, MSFT, GOOGL, AMZN, TSLA, JPM, BAC, XOM, JNJ, PFE, and more.

## License

MIT

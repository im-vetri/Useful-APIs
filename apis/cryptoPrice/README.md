# CryptoPrice — CoinGecko Helpers

A lightweight helper/wrapper around the public CoinGecko API. Provides:
- Current prices and market data
- OHLC and historical market charts
- Portfolio value calculation
- Simple polling-based price alerts

Note: CoinGecko is REST-only (no official websocket). Keep polling intervals reasonable to avoid rate limits.

---

## Quick Start

### Browser
Include the script and call functions from the global `CryptoPriceAPI` object (the module exposes `window.CryptoPriceAPI` when loaded in the browser):

```html
<script src="cryptoPrice.js"></script>
<script>
  // Get current prices for bitcoin + ethereum
  CryptoPriceAPI.getCurrentPrices(['bitcoin','ethereum']).then(console.log).catch(console.error);

  // Calculate portfolio value
  CryptoPriceAPI.calculatePortfolioValue([
    { id: 'bitcoin', amount: 0.05 },
    { id: 'ethereum', amount: 1 }
  ], 'usd').then(console.log).catch(console.error);

  // Subscribe to a price alert (auto-clears after trigger)
  const alertId = CryptoPriceAPI.subscribePriceAlert(
    'bitcoin',
    60000,        // target price
    'above',      // direction: 'above' | 'below'
    30000,        // poll interval ms
    'usd',
    payload => console.log('alert', payload)
  );
</script>
```

### Node.js
```javascript
const CryptoPriceAPI = require('./cryptoPrice.js');

// Get current prices for bitcoin + ethereum
CryptoPriceAPI.getCurrentPrices(['bitcoin','ethereum'])
  .then(prices => console.log(prices))
  .catch(error => console.error(error));

// Calculate portfolio value
CryptoPriceAPI.calculatePortfolioValue([
    { id: 'bitcoin', amount: 0.05 },
    { id: 'ethereum', amount: 1 }
  ], 'usd')
  .then(value => console.log(value))
  .catch(error => console.error(error));
```

## API Functions

| Function | Parameters | Description |
|----------|-----------|-------------|
| `getCurrentPrices(ids)` | `ids` (array of strings) | Fetch current prices for a list of coin IDs |
| `getPriceHistory(id, days)` | `id` (string), `days` (number) | Fetch historical price data for a coin |
| `getMarketData(id)` | `id` (string) | Fetch current market data for a coin |
| `calculatePortfolioValue(portfolio, currency)` | `portfolio` (array), `currency` (string) | Calculate the total value of a portfolio in the specified currency |
| `subscribePriceAlert(id, targetPrice, direction, interval, currency, callback)` | `id`, `targetPrice`, `direction`, `interval`, `currency`, `callback` | Subscribe to price alerts for a coin |

## Response Format

### Success Responses
- **getCurrentPrices**: Returns an object with coin IDs as keys and price data as values.
- **getPriceHistory**: Returns an array of price data points.
- **getMarketData**: Returns an object with market data for the coin.
- **calculatePortfolioValue**: Returns the total portfolio value in the specified currency.
- **subscribePriceAlert**: Returns a subscription ID.

### Error Responses
All functions return rejected promises on error with descriptive messages.

```javascript
CryptoPriceAPI.getCurrentPrices(['bitcoin'])
  .catch(error => console.error('Error:', error.message));
```

## Examples

### Get Current Prices
```javascript
CryptoPriceAPI.getCurrentPrices(['bitcoin', 'ethereum'])
  .then(prices => {
    console.log('Bitcoin price:', prices.bitcoin.price);
    console.log('Ethereum price:', prices.ethereum.price);
  });
```

### Get Price History
```javascript
CryptoPriceAPI.getPriceHistory('bitcoin', 30)
  .then(history => console.log('Price history:', history));
```

### Get Market Data
```javascript
CryptoPriceAPI.getMarketData('bitcoin')
  .then(data => console.log('Market data:', data));
```

### Calculate Portfolio Value
```javascript
const portfolio = [
  { id: 'bitcoin', amount: 0.5 },
  { id: 'ethereum', amount: 2 }
];

CryptoPriceAPI.calculatePortfolioValue(portfolio, 'usd')
  .then(value => console.log('Portfolio value:', value));
```

### Subscribe to Price Alerts
```javascript
const alertId = CryptoPriceAPI.subscribePriceAlert(
  'bitcoin',
  60000,
  'above',
  30000,
  'usd',
  payload => console.log('Price alert triggered:', payload)
);
```

## License

MIT

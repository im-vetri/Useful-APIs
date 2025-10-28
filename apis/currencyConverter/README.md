# Currency Converter API

Real-time currency conversion with live exchange rates. Convert between 160+ currencies instantly.

## Quick Start

### Browser
```html
<script src="currencyConverter.js"></script>

<script>
  // Convert 100 USD to EUR
  currencyConverterAPI.convert(100, 'USD', 'EUR')
    .then(result => {
      console.log(`${result.amount} ${result.fromCurrency} = ${result.convertedAmount} ${result.toCurrency}`);
    })
    .catch(error => console.error(error));
</script>
```

### Node.js
```javascript
const { convert } = require('./currencyConverter.js');

// Convert 100 USD to EUR
convert(100, 'USD', 'EUR')
  .then(result => {
    console.log(`${result.amount} ${result.fromCurrency} = ${result.convertedAmount} ${result.toCurrency}`);
  })
  .catch(error => console.error(error));
```

## API Functions

| Function | Parameters | Description |
|----------|-----------|-------------|
| `convert(amount, from, to)` | amount, fromCurrency, toCurrency | Convert amount from one currency to another |
| `getExchangeRates(baseCurrency)` | baseCurrency | Get all exchange rates for a base currency |
| `getRate(fromCurrency, toCurrency)` | fromCurrency, toCurrency | Get exchange rate between two currencies |
| `convertMultiple(amounts, from, to)` | amounts[], fromCurrency, toCurrency | Convert multiple amounts at once |

## Supported Currencies

160+ currencies including USD, EUR, GBP, JPY, CAD, AUD, INR, CNY, and more.

## Response Format

### Convert Response
```javascript
{
  amount: 100,
  fromCurrency: "USD",
  toCurrency: "EUR",
  rate: 0.92,
  convertedAmount: 92.00,
  timestamp: "2025-10-28T10:30:00.000Z"
}
```

### Exchange Rates Response
```javascript
{
  base: "USD",
  date: "2025-10-28",
  rates: { EUR: 0.92, GBP: 0.79, ... },
  supportedCurrencies: ["EUR", "GBP", ...]
}
```

## Examples

### Simple Conversion
```javascript
const result = await currencyConverterAPI.convert(50, 'USD', 'INR');
console.log(`50 USD = ${result.convertedAmount} INR`);
```

### Get All Exchange Rates
```javascript
const rates = await currencyConverterAPI.getExchangeRates('USD');
console.log(rates.rates); // All currencies against USD
```

### Convert Multiple Amounts
```javascript
const conversions = await currencyConverterAPI.convertMultiple([10, 50, 100], 'USD', 'EUR');
conversions.forEach(conv => {
  console.log(`${conv.amount} USD = ${conv.convertedAmount} EUR`);
});
```

## License

MIT

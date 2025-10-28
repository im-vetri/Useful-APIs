# Currency Converter API - Complete Documentation

## Overview

The Currency Converter API provides real-time currency conversion and exchange rate lookup. It supports 160+ currencies with live rates updated daily.

**Base URL**: `https://api.exchangerate-api.com/v4/latest`

**Dependencies**: None (uses native Fetch API)

**Environments**: Browser and Node.js

## Installation

1. Copy `currencyConverter.js` to your project
2. Node.js: `const { convert, getRate } = require('./currencyConverter.js');`
3. Browser: `<script src="currencyConverter.js"></script>`

## Function Reference

### convert(amount, fromCurrency, toCurrency)

Converts an amount from one currency to another with real-time rates.

**Parameters**:
- `amount` (number, required) - The amount to convert (must be > 0)
- `fromCurrency` (string, required) - Source currency code (e.g., 'USD', 'EUR')
- `toCurrency` (string, required) - Target currency code (e.g., 'EUR', 'GBP')

**Returns**: Promise<Object> - Conversion result with rate and converted amount

**Example**:
```javascript
const result = await currencyConverterAPI.convert(100, 'USD', 'EUR');
console.log(result);
// Output:
// {
//   amount: 100,
//   fromCurrency: 'USD',
//   toCurrency: 'EUR',
//   rate: 0.92,
//   convertedAmount: 92.00,
//   timestamp: '2025-10-28T10:30:00.000Z'
// }
```

**Error Handling**:
```javascript
try {
  await currencyConverterAPI.convert(-50, 'USD', 'EUR'); // Invalid: negative amount
} catch (error) {
  console.error(error.message); // "Amount must be a positive number"
}
```

---

### getExchangeRates(baseCurrency)

Fetches all exchange rates for a given base currency.

**Parameters**:
- `baseCurrency` (string, required) - Base currency code (e.g., 'USD')

**Returns**: Promise<Object> - Exchange rates object with all supported currencies

**Example**:
```javascript
const rates = await currencyConverterAPI.getExchangeRates('USD');
console.log(rates);
// Output:
// {
//   base: 'USD',
//   date: '2025-10-28',
//   rates: {
//     EUR: 0.92,
//     GBP: 0.79,
//     JPY: 149.50,
//     INR: 83.12,
//     ... (160+ currencies)
//   },
//   supportedCurrencies: ['EUR', 'GBP', 'JPY', ...]
// }
```

**Common Use Cases**:
```javascript
// Get all rates and filter by multiple currencies
const rates = await currencyConverterAPI.getExchangeRates('USD');
const eurRate = rates.rates['EUR'];
const gbpRate = rates.rates['GBP'];
```

---

### getRate(fromCurrency, toCurrency)

Gets the exchange rate between two specific currencies.

**Parameters**:
- `fromCurrency` (string, required) - Source currency code
- `toCurrency` (string, required) - Target currency code

**Returns**: Promise<number> - The exchange rate

**Example**:
```javascript
const rate = await currencyConverterAPI.getRate('USD', 'EUR');
console.log(rate); // 0.92

// Manual conversion using the rate
const usdAmount = 100;
const eurAmount = usdAmount * rate; // 92
```

---

### convertMultiple(amounts, fromCurrency, toCurrency)

Converts multiple amounts in a single API call, more efficient than calling convert() multiple times.

**Parameters**:
- `amounts` (number[], required) - Array of amounts to convert
- `fromCurrency` (string, required) - Source currency code
- `toCurrency` (string, required) - Target currency code

**Returns**: Promise<Array> - Array of conversion results

**Example**:
```javascript
const conversions = await currencyConverterAPI.convertMultiple(
  [10, 50, 100, 500],
  'USD',
  'EUR'
);
console.log(conversions);
// Output:
// [
//   { amount: 10, convertedAmount: 9.20, rate: 0.92 },
//   { amount: 50, convertedAmount: 46.00, rate: 0.92 },
//   { amount: 100, convertedAmount: 92.00, rate: 0.92 },
//   { amount: 500, convertedAmount: 460.00, rate: 0.92 }
// ]
```

**Use Case - Price List Conversion**:
```javascript
const pricesInUSD = [9.99, 19.99, 49.99, 99.99];
const pricesInEUR = await currencyConverterAPI.convertMultiple(pricesInUSD, 'USD', 'EUR');
pricesInEUR.forEach((item, index) => {
  console.log(`${pricesInUSD[index]} USD = ${item.convertedAmount} EUR`);
});
```

---

## Supported Currencies

The API supports 160+ currencies. Here are common ones:

| Code | Currency | Code | Currency |
|------|----------|------|----------|
| USD | US Dollar | EUR | Euro |
| GBP | British Pound | JPY | Japanese Yen |
| CAD | Canadian Dollar | AUD | Australian Dollar |
| CHF | Swiss Franc | CNY | Chinese Yuan |
| INR | Indian Rupee | MXN | Mexican Peso |
| BRL | Brazilian Real | SGD | Singapore Dollar |
| HKD | Hong Kong Dollar | SEK | Swedish Krona |

## Error Handling

All functions return rejected promises on error with descriptive messages.

| Error | Cause | Solution |
|-------|-------|----------|
| "Amount must be a positive number" | Invalid amount | Use positive number |
| "fromCurrency must be a valid currency code" | Missing/invalid source | Use valid 3-letter code |
| "toCurrency must be a valid currency code" | Missing/invalid target | Use valid 3-letter code |
| "Currency code not found" | Unsupported currency | Check supported currencies |
| "Failed to fetch exchange rates" | API error | Check internet connection |

**Error Handling Example**:
```javascript
try {
  const result = await currencyConverterAPI.convert(100, 'USD', 'XYZ');
} catch (error) {
  console.error('Conversion failed:', error.message);
  // Handle error gracefully
}
```

---

## Usage Examples

### Real-Time Price Display
```javascript
async function displayPriceInLocalCurrency(priceUSD, localCurrency) {
  try {
    const result = await currencyConverterAPI.convert(priceUSD, 'USD', localCurrency);
    console.log(`Price: ${result.convertedAmount} ${result.toCurrency}`);
  } catch (error) {
    console.error('Failed to convert price:', error);
  }
}

displayPriceInLocalCurrency(29.99, 'EUR');
```

### Multi-Currency Rates Table
```javascript
async function buildRatesTable(baseCurrency) {
  const rates = await currencyConverterAPI.getExchangeRates(baseCurrency);
  const table = {};
  
  ['EUR', 'GBP', 'JPY', 'INR', 'AUD'].forEach(currency => {
    table[currency] = rates.rates[currency];
  });
  
  return table;
}

const rates = await buildRatesTable('USD');
```

### E-commerce Cart Conversion
```javascript
async function convertCartTotal(cartTotalUSD, userCurrency) {
  try {
    const rate = await currencyConverterAPI.getRate('USD', userCurrency);
    const total = (cartTotalUSD * rate).toFixed(2);
    return { amount: total, currency: userCurrency, rate };
  } catch (error) {
    console.error('Conversion failed, using USD:', error);
    return { amount: cartTotalUSD, currency: 'USD' };
  }
}
```

### Batch Price Conversion
```javascript
async function convertPricelist(prices, targetCurrency) {
  return await currencyConverterAPI.convertMultiple(prices, 'USD', targetCurrency);
}

const productPrices = [9.99, 19.99, 49.99, 99.99];
const euroPrices = await convertPricelist(productPrices, 'EUR');
```

---

## Performance Considerations

- Each function makes one HTTP request to the exchange rate API
- Responses typically return within 100-300ms
- Rates update daily; same-day conversions use cached rates
- Use `convertMultiple()` instead of multiple `convert()` calls for better performance
- Consider caching rates locally if refreshing frequently

## API Rate Limits

ExchangeRate-API free tier:
- 1,500 requests per month
- Suitable for most applications

For production, consider:
- Caching rates in your database
- Implementing rate limiting
- Using premium API tier if needed

## Browser Compatibility

- Chrome 40+
- Firefox 40+
- Safari 10+
- Edge 14+
- Node.js 14+

Requires support for:
- Fetch API
- Promise API

## License

MIT

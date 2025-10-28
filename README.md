# Useful-APIs

A collection of simple, plug-and-play APIs for developers. Easy to integrate, well-documented, and production-ready.

## Available APIs

### 1. Random User Generator

Generate random user profiles for testing, development, and mock data.

Features:
- Fetch single or multiple random users
- Filter by gender and nationality
- Works in Node.js and Browser
- Zero dependencies

Quick Start:
```javascript
const { getSingleUser } = require("./apis/randomUser/randomUser.js");
const user = await getSingleUser();
console.log(user.name.first, user.email);
```

Documentation: [Read Full Docs](./docs/randomUser.md)

Examples:
- [Browser Example](./examples/randomUser-browser.html)
- [Node.js Example](./examples/randomUser-node.js)

### 2. Chuck Norris Jokes

Fetch random Chuck Norris jokes, search by keyword, or browse by category.

Features:
- Get random jokes
- Search jokes by keyword
- Browse by category
- Fetch specific jokes by ID
- Works in Node.js and Browser
- Zero dependencies

Quick Start:
```javascript
const chuckNorrisAPI = require("./apis/chuckNorris/chuckNorris.js");
const joke = await chuckNorrisAPI.getRandomJoke();
console.log(joke.value);
```

Documentation: [Read Full Docs](./docs/chuckNorris.md)

Examples:
- [Browser Example](./examples/chuckNorris-browser.html)
- [Node.js Example](./examples/chuckNorris-node.js)

### 3. Currency Converter

Real-time currency conversion with live exchange rates for 160+ currencies.

Features:
- Convert between 160+ currencies
- Get live exchange rates
- Batch convert multiple amounts
- View all rates for a base currency
- Works in Node.js and Browser
- Zero dependencies

Quick Start:
```javascript
const { convert } = require("./apis/currencyConverter/currencyConverter.js");
const result = await convert(100, 'USD', 'EUR');
console.log(`${result.amount} USD = ${result.convertedAmount} EUR`);
```

Documentation: [Read Full Docs](./docs/currencyConverter.md)

Examples:
- [Browser Example](./examples/currencyConverter-browser.html)
- [Node.js Example](./examples/currencyConverter-node.js)

## Project Structure

```
Useful-APIs/
├── apis/
│   ├── randomUser/
│   │   ├── randomUser.js
│   │   ├── package.json
│   │   └── README.md
│   ├── chuckNorris/
│   │   ├── chuckNorris.js
│   │   ├── package.json
│   │   └── README.md
│   ├── currencyConverter/
│   │   ├── currencyConverter.js
│   │   ├── package.json
│   │   └── README.md
│   └── [future-apis]/
├── docs/
│   ├── randomUser.md
│   ├── chuckNorris.md
│   └── currencyConverter.md
├── examples/
│   ├── randomUser-browser.html
│   ├── randomUser-node.js
│   ├── chuckNorris-browser.html
│   ├── chuckNorris-node.js
│   ├── currencyConverter-browser.html
│   └── currencyConverter-node.js
├── README.md
├── CONTRIBUTING.md
└── LICENSE
```

## Features

- Simple APIs - Easy to understand and integrate
- Well Documented - Comprehensive docs and examples
- Multiple Environments - Works in Node.js and Browser
- Zero Dependencies - Uses native APIs only
- Examples Included - Browser and Node.js examples
- Plug & Play - Copy and use immediately

## Contributing

Want to add a new API? Check out [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

See [LICENSE](./LICENSE) file for details.

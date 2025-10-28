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

## Project Structure

```
Useful-APIs/
├── apis/
│   ├── randomUser/
│   │   ├── randomUser.js
│   │   ├── package.json
│   │   └── README.md
│   └── [future-apis]/
├── docs/
│   └── randomUser.md
├── examples/
│   ├── randomUser-browser.html
│   └── randomUser-node.js
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

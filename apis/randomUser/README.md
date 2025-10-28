# Random User Generator API

Generate random user profiles for testing and development.

## Quick Start

Browser:
```javascript
<script src="randomUser.js"></script>
<script>
  const user = await window.RandomUserAPI.getSingleUser();
</script>
```

Node.js:
```javascript
const { getSingleUser } = require("./randomUser.js");
const user = await getSingleUser();
```

## API Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `getSingleUser(gender)` | Get one user | `getSingleUser("female")` |
| `getRandomUsers(count, filters)` | Get multiple users | `getRandomUsers(5, {gender: "male"})` |
| `getRandomUser(results, gender, nat)` | Full control | `getRandomUser(10, "female", "US")` |

## Documentation

See `../../docs/randomUser.md` for complete documentation.

## Examples

- Browser: `../../examples/randomUser-browser.html`
- Node.js: `../../examples/randomUser-node.js`


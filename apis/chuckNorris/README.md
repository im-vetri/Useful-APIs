# Chuck Norris Jokes API

A lightweight wrapper for the Chuck Norris Jokes API. Get random jokes, search by keyword, or fetch jokes by category.

## Quick Start

### Browser
```html
<script src="chuckNorris.js"></script>

<script>
  // Get a random joke
  chuckNorrisAPI.getRandomJoke()
    .then(joke => console.log(joke.value))
    .catch(error => console.error(error));
</script>
```

### Node.js
```javascript
const chuckNorrisAPI = require('./chuckNorris.js');

// Get a random joke
chuckNorrisAPI.getRandomJoke()
  .then(joke => console.log(joke.value))
  .catch(error => console.error(error));
```

## API Functions

| Function | Parameters | Description |
|----------|-----------|-------------|
| `getRandomJoke()` | None | Fetch a random Chuck Norris joke |
| `getJokeById(jokeId)` | `jokeId` (string) | Fetch a specific joke by ID |
| `searchJokes(query)` | `query` (string) | Search jokes by keyword |
| `getRandomJokes(count)` | `count` (1-10) | Get multiple random jokes |
| `getCategories()` | None | Get all available joke categories |
| `getJokeByCategory(category)` | `category` (string) | Get a random joke from a specific category |

## Response Format

Each joke object contains:
```javascript
{
  id: "8",
  url: "https://api.chucknorris.io/jokes/8",
  value: "...",
  categories: ["nerdy"]
}
```

## Error Handling

All functions return rejected promises on error with descriptive messages.

```javascript
chuckNorrisAPI.getRandomJoke()
  .catch(error => console.error('Error:', error.message));
```

## Examples

### Get a Random Joke
```javascript
chuckNorrisAPI.getRandomJoke()
  .then(joke => console.log(joke.value));
```

### Search for Jokes
```javascript
chuckNorrisAPI.searchJokes('norris')
  .then(results => console.log(`Found ${results.total} jokes`));
```

### Get Jokes by Category
```javascript
chuckNorrisAPI.getCategories()
  .then(categories => console.log(categories));

// Then fetch a joke from a specific category
chuckNorrisAPI.getJokeByCategory('nerdy')
  .then(joke => console.log(joke.value));
```

## License

MIT

# Chuck Norris Jokes API - Complete Documentation

## Overview

The Chuck Norris API wrapper provides a simple, zero-dependency interface to fetch Chuck Norris jokes. It supports random jokes, category-based fetching, ID-based lookup, and keyword searching.

**Base URL**: `https://api.chucknorris.io/jokes`

**Dependencies**: None (uses native Fetch API)

**Environments**: Browser and Node.js

## Installation

1. Copy `chuckNorris.js` to your project directory
2. Import in Node.js: `const chuckNorrisAPI = require('./chuckNorris.js');`
3. Import in Browser: `<script src="chuckNorris.js"></script>`

## Function Reference

### getRandomJoke()

Returns a random Chuck Norris joke.

**Parameters**: None

**Returns**: Promise<Object> - Joke object

**Example**:
```javascript
chuckNorrisAPI.getRandomJoke()
  .then(joke => {
    console.log(joke.value);
    console.log(joke.id);
    console.log(joke.categories);
  })
  .catch(error => console.error(error));
```

**Response**:
```json
{
  "id": "8",
  "url": "https://api.chucknorris.io/jokes/8",
  "value": "...",
  "categories": ["nerdy"]
}
```

---

### getJokeById(jokeId)

Fetch a specific joke by its ID.

**Parameters**:
- `jokeId` (string, required) - The ID of the joke to retrieve

**Returns**: Promise<Object> - Joke object

**Example**:
```javascript
chuckNorrisAPI.getJokeById('8')
  .then(joke => console.log(joke.value))
  .catch(error => console.error(error));
```

**Error Handling**:
```javascript
try {
  const joke = await chuckNorrisAPI.getJokeById(null);
} catch (error) {
  console.error('Invalid joke ID'); // jokeId is required
}
```

---

### searchJokes(query)

Search for jokes containing a specific keyword.

**Parameters**:
- `query` (string, required) - The search term

**Returns**: Promise<Object> - Search results object with total count and results array

**Example**:
```javascript
chuckNorrisAPI.searchJokes('programming')
  .then(results => {
    console.log(`Found ${results.total} jokes`);
    results.result.forEach(joke => console.log(joke.value));
  })
  .catch(error => console.error(error));
```

**Response**:
```json
{
  "total": 3,
  "result": [
    { "id": "...", "value": "...", "url": "...", "categories": [...] },
    { "id": "...", "value": "...", "url": "...", "categories": [...] }
  ]
}
```

---

### getRandomJokes(count)

Get multiple random jokes at once.

**Parameters**:
- `count` (number, required) - Number of jokes to fetch (1-10)

**Returns**: Promise<Array> - Array of joke objects

**Example**:
```javascript
chuckNorrisAPI.getRandomJokes(5)
  .then(jokes => {
    jokes.forEach(joke => console.log(joke.value));
  })
  .catch(error => console.error(error));
```

**Validation**:
```javascript
// Valid: count between 1 and 10
chuckNorrisAPI.getRandomJokes(5);

// Error: count must be between 1 and 10
chuckNorrisAPI.getRandomJokes(15);
```

---

### getCategories()

Retrieve all available joke categories.

**Parameters**: None

**Returns**: Promise<Array> - Array of category names

**Example**:
```javascript
chuckNorrisAPI.getCategories()
  .then(categories => {
    console.log(categories); // ['explicit', 'nerdy', 'knock-knock', ...]
  })
  .catch(error => console.error(error));
```

**Response**:
```javascript
["explicit", "nerdy", "knock-knock", "oneliner"]
```

---

### getJokeByCategory(category)

Get a random joke from a specific category.

**Parameters**:
- `category` (string, required) - The category name

**Returns**: Promise<Object> - Joke object

**Example**:
```javascript
// First get available categories
chuckNorrisAPI.getCategories()
  .then(categories => {
    // Pick a random category and fetch a joke
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    return chuckNorrisAPI.getJokeByCategory(randomCategory);
  })
  .then(joke => console.log(joke.value))
  .catch(error => console.error(error));
```

**Common Categories**:
- `explicit`
- `nerdy`
- `knock-knock`
- `oneliner`

---

## Error Handling

All functions use try-catch internally and return rejected promises on error.

**Common Errors**:

| Error | Cause | Solution |
|-------|-------|----------|
| "jokeId is required" | `getJokeById()` called without ID | Provide valid joke ID |
| "query is required" | `searchJokes()` called without query | Provide search term |
| "count must be between 1 and 10" | `getRandomJokes()` count out of range | Use count 1-10 |
| "category is required" | `getJokeByCategory()` called without category | Provide category name |
| Network/Fetch errors | API unreachable or network issue | Check internet connection |

**Error Handling Example**:
```javascript
try {
  const joke = await chuckNorrisAPI.getRandomJoke();
  console.log(joke.value);
} catch (error) {
  console.error('Failed to fetch joke:', error.message);
}
```

---

## Usage Examples

### Simple Random Joke Display
```javascript
chuckNorrisAPI.getRandomJoke()
  .then(joke => {
    document.getElementById('joke').textContent = joke.value;
  });
```

### Fetch 3 Random Jokes
```javascript
chuckNorrisAPI.getRandomJokes(3)
  .then(jokes => {
    jokes.forEach((joke, index) => {
      console.log(`Joke ${index + 1}: ${joke.value}`);
    });
  });
```

### Search and Display Results
```javascript
chuckNorrisAPI.searchJokes('developer')
  .then(results => {
    console.log(`Total jokes about developer: ${results.total}`);
    return results.result.slice(0, 5); // Get first 5
  })
  .then(topJokes => {
    topJokes.forEach(joke => console.log(`• ${joke.value}`));
  });
```

### Category-Based Jokes
```javascript
(async () => {
  try {
    const categories = await chuckNorrisAPI.getCategories();
    console.log('Available categories:', categories);
    
    // Get joke from each category
    for (const category of categories) {
      const joke = await chuckNorrisAPI.getJokeByCategory(category);
      console.log(`[${category}] ${joke.value}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
})();
```

---

## Browser Compatibility

- Chrome 40+
- Firefox 40+
- Safari 10+
- Edge 14+
- Node.js 14+

Requires support for:
- Fetch API
- Promise API
- ES6 module syntax (or CommonJS for Node.js)

---

## Performance Considerations

- Each function makes a single HTTP request to the Chuck Norris API
- Responses are typically returned within 100-500ms
- Consider caching results for repeated queries
- The API has rate limiting; avoid excessive rapid requests

---

## License

MIT

# Movie/TV Database API

Search for movies and TV shows with detailed information including ratings, cast, plot, and more. Uses OMDB API (free tier available).

## Quick Start

### Get Free API Key
Visit [omdbapi.com](https://www.omdbapi.com/apikey.aspx) to get your free API key.

### Browser
```html
<script src="movieDatabase.js"></script>

<script>
  const apiKey = 'YOUR_OMDB_API_KEY';
  
  // Search for movies
  movieDatabaseAPI.searchMovies('Inception', apiKey)
    .then(data => {
      data.results.forEach(movie => {
        console.log(`${movie.title} (${movie.year})`);
      });
    })
    .catch(error => console.error(error));
</script>
```

### Node.js
```javascript
const { searchMovies, getDetails } = require('./movieDatabase.js');

const apiKey = 'YOUR_OMDB_API_KEY';

// Search
const movies = await searchMovies('The Matrix', apiKey);
console.log(movies.results);

// Get details
const details = await getDetails('tt0133093', apiKey);
console.log(details.plot);
```

## API Functions

| Function | Description |
|----------|-------------|
| `search(title, apiKey, options)` | Search movies or shows |
| `searchMovies(title, apiKey, options)` | Search movies only |
| `searchSeries(title, apiKey, options)` | Search TV series only |
| `getDetails(imdbId, apiKey)` | Get full movie details |
| `calculateAverageRating(ratings)` | Calculate rating average |
| `getPopularMovies()` | Get popular movie titles |
| `getPopularSeries()` | Get popular series titles |

## Examples

### Search Movies
```javascript
const results = await movieDatabaseAPI.searchMovies('Avatar', apiKey);
```

### Get Movie Details
```javascript
const movie = await movieDatabaseAPI.getDetails('tt0468569', apiKey);
console.log(movie.plot);
console.log(movie.imdbRating);
```

## License

MIT

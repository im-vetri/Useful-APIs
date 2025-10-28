# News API

Get latest news headlines and search articles from 150+ news sources worldwide. Get your free API key from NewsAPI.org.

## Quick Start

### Get Free API Key
Visit [newsapi.org](https://newsapi.org) to get your free API key.

### Browser
```html
<script src="newsAPI.js"></script>

<script>
  const apiKey = 'YOUR_NEWSAPI_KEY';
  
  // Get top US headlines
  newsAPI.getTopHeadlines('us', apiKey)
    .then(data => {
      data.articles.forEach(article => {
        console.log(`${article.title}`);
        console.log(`Source: ${article.source}`);
      });
    })
    .catch(error => console.error(error));
</script>
```

### Node.js
```javascript
const { getTopHeadlines, searchNews } = require('./newsAPI.js');

const apiKey = 'YOUR_NEWSAPI_KEY';

// Get headlines
const headlines = await getTopHeadlines('us', apiKey);
console.log(`Found ${headlines.totalResults} articles`);
```

## API Functions

| Function | Description |
|----------|-------------|
| `getTopHeadlines(country, apiKey, options)` | Get top headlines by country |
| `searchNews(query, apiKey, options)` | Search news articles |
| `getNewsByCategory(category, apiKey, options)` | Get news by category |
| `getSupportedCountries()` | List supported countries |
| `getSupportedCategories()` | List available categories |
| `filterArticlesByDate(articles, daysOld)` | Filter articles by age |

## Examples

### Get Headlines
```javascript
const data = await newsAPI.getTopHeadlines('gb', apiKey);
```

### Search News
```javascript
const results = await newsAPI.searchNews('cryptocurrency', apiKey, {
  sortBy: 'publishedAt',
  pageSize: 50
});
```

### Get Category News
```javascript
const tech = await newsAPI.getNewsByCategory('technology', apiKey);
```

## License

MIT

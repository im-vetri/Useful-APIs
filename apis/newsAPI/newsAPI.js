/**
 * News API
 * Get latest news articles from NewsAPI
 * 
 * @author Useful-APIs Contributors
 * @version 1.0.0
 */

const BASE_URL = "https://newsapi.org/v2";

/**
 * Gets top headlines by country
 * @param {string} country - Country code (e.g., 'us', 'gb', 'in')
 * @param {string} apiKey - NewsAPI key
 * @param {Object} options - Additional options (category, page, pageSize)
 * @returns {Promise<Object>} Headlines data
 */
async function getTopHeadlines(country, apiKey, options = {}) {
    try {
        if (!country || typeof country !== 'string') {
            throw new Error('Country code must be provided');
        }

        if (!apiKey) {
            throw new Error('API key required. Get one at https://newsapi.org');
        }

        const { category = '', page = 1, pageSize = 20 } = options;

        let url = `${BASE_URL}/top-headlines?country=${encodeURIComponent(country.toLowerCase())}`;
        url += `&apiKey=${apiKey}`;
        url += `&page=${page}`;
        url += `&pageSize=${Math.min(pageSize, 100)}`;

        if (category) {
            url += `&category=${encodeURIComponent(category)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch headlines: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'error') {
            throw new Error(data.message || 'Failed to fetch headlines');
        }

        return {
            status: data.status,
            totalResults: data.totalResults,
            articles: data.articles.map(article => ({
                source: article.source.name,
                author: article.author,
                title: article.title,
                description: article.description,
                url: article.url,
                image: article.urlToImage,
                published: article.publishedAt,
                content: article.content
            }))
        };
    } catch (error) {
        console.error('Error fetching top headlines:', error);
        throw error;
    }
}

/**
 * Searches news articles by keyword
 * @param {string} query - Search query
 * @param {string} apiKey - NewsAPI key
 * @param {Object} options - Search options (sortBy, language, page, pageSize)
 * @returns {Promise<Object>} Search results
 */
async function searchNews(query, apiKey, options = {}) {
    try {
        if (!query || typeof query !== 'string') {
            throw new Error('Search query must be provided');
        }

        if (!apiKey) {
            throw new Error('API key required');
        }

        const { sortBy = 'publishedAt', language = 'en', page = 1, pageSize = 20 } = options;

        let url = `${BASE_URL}/everything?q=${encodeURIComponent(query)}`;
        url += `&apiKey=${apiKey}`;
        url += `&sortBy=${sortBy}`;
        url += `&language=${language}`;
        url += `&page=${page}`;
        url += `&pageSize=${Math.min(pageSize, 100)}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to search news: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'error') {
            throw new Error(data.message || 'Search failed');
        }

        return {
            status: data.status,
            totalResults: data.totalResults,
            articles: data.articles.map(article => ({
                source: article.source.name,
                author: article.author,
                title: article.title,
                description: article.description,
                url: article.url,
                image: article.urlToImage,
                published: article.publishedAt,
                content: article.content
            }))
        };
    } catch (error) {
        console.error('Error searching news:', error);
        throw error;
    }
}

/**
 * Gets news by category
 * @param {string} category - Category (business, entertainment, health, science, sports, technology)
 * @param {string} apiKey - NewsAPI key
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Category news
 */
async function getNewsByCategory(category, apiKey, options = {}) {
    const validCategories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];

    if (!validCategories.includes(category)) {
        throw new Error(`Category must be one of: ${validCategories.join(', ')}`);
    }

    return getTopHeadlines('us', apiKey, { ...options, category });
}

/**
 * Gets supported countries
 * @returns {Array} Array of supported country codes
 */
function getSupportedCountries() {
    return [
        'ae', 'ar', 'at', 'au', 'be', 'bg', 'br', 'ca', 'ch', 'cn', 'co', 'cu', 'cz',
        'de', 'eg', 'fr', 'gb', 'gr', 'hk', 'hu', 'id', 'ie', 'il', 'in', 'it', 'jp',
        'kr', 'lt', 'lv', 'mx', 'my', 'ng', 'nl', 'no', 'nz', 'ph', 'pl', 'pt', 'ro',
        'rs', 'ru', 'sa', 'se', 'sg', 'sk', 'th', 'tr', 'tw', 'ua', 'us', 've', 'za'
    ];
}

/**
 * Gets supported categories
 * @returns {Array} Array of available news categories
 */
function getSupportedCategories() {
    return ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
}

/**
 * Filters articles by date
 * @param {Array} articles - Articles to filter
 * @param {number} daysOld - Maximum age in days
 * @returns {Array} Filtered articles
 */
function filterArticlesByDate(articles, daysOld) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    return articles.filter(article => new Date(article.published) >= cutoffDate);
}

// Export for Node.js and Browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getTopHeadlines,
        searchNews,
        getNewsByCategory,
        getSupportedCountries,
        getSupportedCategories,
        filterArticlesByDate
    };
}

if (typeof window !== 'undefined') {
    window.newsAPI = {
        getTopHeadlines,
        searchNews,
        getNewsByCategory,
        getSupportedCountries,
        getSupportedCategories,
        filterArticlesByDate
    };
}

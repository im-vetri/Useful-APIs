/**
 * Movie/TV Database API
 * Search for movies and TV shows using OMDB API
 * 
 * @author Useful-APIs Contributors
 * @version 1.0.0
 */

const BASE_URL = "https://www.omdbapi.com";

/**
 * Searches for movies/shows by title
 * @param {string} title - Movie or show title to search
 * @param {string} apiKey - OMDB API key
 * @param {Object} options - Search options (type, year, page)
 * @returns {Promise<Object>} Search results
 */
async function search(title, apiKey, options = {}) {
    try {
        if (!title || typeof title !== 'string') {
            throw new Error('Title must be a non-empty string');
        }

        if (!apiKey) {
            throw new Error('API key required. Get one at https://www.omdbapi.com/apikey.aspx');
        }

        const { type = '', year = '', page = 1 } = options;

        let url = `${BASE_URL}/?apikey=${apiKey}`;
        url += `&s=${encodeURIComponent(title)}`;
        url += `&type=${type}`;
        url += `&y=${year}`;
        url += `&page=${page}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to search: ${response.status}`);
        }

        const data = await response.json();

        if (data.Response === 'False') {
            throw new Error(data.Error || 'No results found');
        }

        return {
            totalResults: parseInt(data.totalResults),
            results: data.Search.map(item => ({
                title: item.Title,
                year: item.Year,
                imdbId: item.imdbID,
                type: item.Type,
                poster: item.Poster
            }))
        };
    } catch (error) {
        console.error('Error searching movies:', error);
        throw error;
    }
}

/**
 * Gets detailed information about a movie/show
 * @param {string} id - IMDB ID (e.g., 'tt0111161')
 * @param {string} apiKey - OMDB API key
 * @returns {Promise<Object>} Detailed movie information
 */
async function getDetails(id, apiKey) {
    try {
        if (!id || typeof id !== 'string') {
            throw new Error('IMDB ID must be provided');
        }

        if (!apiKey) {
            throw new Error('API key required');
        }

        const url = `${BASE_URL}/?apikey=${apiKey}&i=${encodeURIComponent(id)}&type=full`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch details: ${response.status}`);
        }

        const data = await response.json();

        if (data.Response === 'False') {
            throw new Error(data.Error || 'Movie not found');
        }

        return {
            title: data.Title,
            year: data.Year,
            rated: data.Rated,
            released: data.Released,
            runtime: data.Runtime,
            genre: data.Genre,
            director: data.Director,
            writer: data.Writer,
            actors: data.Actors,
            plot: data.Plot,
            language: data.Language,
            country: data.Country,
            awards: data.Awards,
            poster: data.Poster,
            ratings: data.Ratings,
            imdbRating: data.imdbRating,
            imdbVotes: data.imdbVotes,
            type: data.Type,
            totalSeasons: data.totalSeasons
        };
    } catch (error) {
        console.error('Error fetching movie details:', error);
        throw error;
    }
}

/**
 * Searches for movies only
 * @param {string} title - Movie title
 * @param {string} apiKey - OMDB API key
 * @param {Object} options - Search options
 * @returns {Promise<Object>} Movie search results
 */
async function searchMovies(title, apiKey, options = {}) {
    return search(title, apiKey, { ...options, type: 'movie' });
}

/**
 * Searches for TV series only
 * @param {string} title - Series title
 * @param {string} apiKey - OMDB API key
 * @param {Object} options - Search options
 * @returns {Promise<Object>} TV series search results
 */
async function searchSeries(title, apiKey, options = {}) {
    return search(title, apiKey, { ...options, type: 'series' });
}

/**
 * Calculates movie rating average
 * @param {Array} ratings - Array of rating objects
 * @returns {number} Average rating
 */
function calculateAverageRating(ratings) {
    if (!Array.isArray(ratings) || ratings.length === 0) {
        return 0;
    }

    const validRatings = ratings
        .map(r => parseFloat(r.Value))
        .filter(v => !isNaN(v));

    return validRatings.length > 0
        ? (validRatings.reduce((a, b) => a + b, 0) / validRatings.length).toFixed(1)
        : 0;
}

/**
 * Gets popular movie recommendations based on search
 * @returns {Array} Array of popular movie titles to search
 */
function getPopularMovies() {
    return [
        'The Shawshank Redemption',
        'The Godfather',
        'Inception',
        'Pulp Fiction',
        'The Dark Knight',
        'Forrest Gump',
        'Avatar',
        'Interstellar',
        'The Matrix',
        'Titanic'
    ];
}

/**
 * Gets popular TV series recommendations
 * @returns {Array} Array of popular series titles to search
 */
function getPopularSeries() {
    return [
        'Game of Thrones',
        'Breaking Bad',
        'Stranger Things',
        'The Office',
        'Friends',
        'Sherlock',
        'The Crown',
        'Chernobyl',
        'The Last of Us',
        'Succession'
    ];
}

// Export for Node.js and Browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        search,
        getDetails,
        searchMovies,
        searchSeries,
        calculateAverageRating,
        getPopularMovies,
        getPopularSeries
    };
}

if (typeof window !== 'undefined') {
    window.movieDatabaseAPI = {
        search,
        getDetails,
        searchMovies,
        searchSeries,
        calculateAverageRating,
        getPopularMovies,
        getPopularSeries
    };
}

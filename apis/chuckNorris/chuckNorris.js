/**
 * Chuck Norris Jokes API
 * Fetches random Chuck Norris jokes from the Official Chuck Norris Database
 * 
 * @author Useful-APIs Contributors
 * @version 1.0.0
 */

const BASE_URL = "https://api.chucknorris.io/jokes";

/**
 * Fetches a random Chuck Norris joke
 * @returns {Promise<Object>} Joke object containing id, url, value
 */
async function getRandomJoke() {
    try {
    const response = await fetch(`${BASE_URL}/random`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
    } catch (error) {
        console.error("Error fetching random joke:", error);
        throw error;
    }
}

/**
 * Fetches a joke by ID
 * @param {string} jokeId - The ID of the joke to fetch
 * @returns {Promise<Object>} Joke object
 */
async function getJokeById(jokeId) {
    try {
        if (!jokeId || typeof jokeId !== "string") {
        throw new Error("Joke ID must be a non-empty string");
        }

        const response = await fetch(`${BASE_URL}/${jokeId}`);

        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching joke by ID:", error);
        throw error;
    }
}

/**
 * Searches for jokes by keyword or phrase
 * @param {string} query - Search term or phrase
 * @returns {Promise<Array>} Array of matching joke objects
 */
async function searchJokes(query) {
    try {
        if (!query || typeof query !== "string") {
        throw new Error("Search query must be a non-empty string");
        }

        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(`${BASE_URL}/search?query=${encodedQuery}`);

        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.result || [];
    } catch (error) {
        console.error("Error searching jokes:", error);
        throw error;
    }
}

/**
 * Fetches multiple random jokes
 * @param {number} count - Number of jokes to fetch (max 10 per request)
 * @returns {Promise<Array>} Array of joke objects
 */
async function getRandomJokes(count = 5) {
    try {
        if (count < 1 || count > 10) {
        throw new Error("Count must be between 1 and 10");
        }

        const jokes = [];
        for (let i = 0; i < count; i++) {
        const joke = await getRandomJoke();
        jokes.push(joke);
        }
        return jokes;
    } catch (error) {
        console.error("Error fetching random jokes:", error);
        throw error;
    }
}

/**
 * Fetches all available joke categories
 * @returns {Promise<Array>} Array of category strings
 */
async function getCategories() {
    try {
        const response = await fetch(`${BASE_URL}/categories`);

        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
}

/**
 * Fetches a random joke from a specific category
 * @param {string} category - The category name
 * @returns {Promise<Object>} Joke object
 */
async function getJokeByCategory(category) {
    try {
        if (!category || typeof category !== "string") {
        throw new Error("Category must be a non-empty string");
        }

        const encodedCategory = encodeURIComponent(category.toLowerCase());
        const response = await fetch(`${BASE_URL}/random?category=${encodedCategory}`);

        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching joke by category:", error);
        throw error;
    }
    }

// Export for Node.js
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        getRandomJoke,
        getJokeById,
        searchJokes,
        getRandomJokes,
        getCategories,
        getJokeByCategory,
    };
}

// For browser usage, expose to window
if (typeof window !== "undefined") {
    window.ChuckNorrisAPI = {
        getRandomJoke,
        getJokeById,
        searchJokes,
        getRandomJokes,
        getCategories,
        getJokeByCategory,
    };
}

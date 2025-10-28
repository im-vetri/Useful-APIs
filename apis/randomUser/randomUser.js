/**
 * Random User Generator API
 * Fetches random user profiles from the RandomUser API
 * 
 * @author Useful-APIs Contributors
 * @version 1.0.0
 */

const BASE_URL = "https://randomuser.me/api";

/**
 * Fetches a random user profile
 * @param {number} results - Number of users to fetch (default: 1, max: 5000)
 * @param {string} gender - Gender filter: 'male', 'female', or 'all' (default: 'all')
 * @param {string} nationality - Nationality code (e.g., 'US', 'FR', 'DE')
 * @returns {Promise<Object>} User profile data
 */
async function getRandomUser(results = 1, gender = "all", nationality = null) {
    try {
    // Validate input
    if (results < 1 || results > 5000) {
        throw new Error("Results must be between 1 and 5000");
    }

    let url = `${BASE_URL}/?results=${results}`;

    if (gender && gender !== "all") {
        url += `&gender=${gender.toLowerCase()}`;
    }

    if (nationality) {
        url += `&nat=${nationality.toUpperCase()}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
    } catch (error) {
    console.error("Error fetching random user:", error);
    throw error;
    }
}

/**
 * Fetches multiple random users
 * @param {number} count - Number of users to fetch
 * @param {Object} filters - Filter options {gender, nationality}
 * @returns {Promise<Array>} Array of user profiles
 */
async function getRandomUsers(count = 5, filters = {}) {
    try {
    const data = await getRandomUser(count, filters.gender, filters.nationality);
    return data.results;
    } catch (error) {
    console.error("Error fetching random users:", error);
    throw error;
    }
}

/**
 * Gets a single user with full details
 * @param {string} gender - Optional gender filter
 * @returns {Promise<Object>} Single user profile object
 */
async function getSingleUser(gender = null) {
    try {
    const data = await getRandomUser(1, gender);
    return data.results[0];
    } catch (error) {
    console.error("Error fetching single user:", error);
    throw error;
    }
}

// Export for Node.js
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
    getRandomUser,
    getRandomUsers,
    getSingleUser,
    };
}

// For browser usage, expose to window
if (typeof window !== "undefined") {
    window.RandomUserAPI = {
    getRandomUser,
    getRandomUsers,
    getSingleUser,
    };
}

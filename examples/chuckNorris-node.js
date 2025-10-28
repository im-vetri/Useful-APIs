// Chuck Norris Jokes API - Node.js Examples
// Run individual examples by uncommenting them

const chuckNorrisAPI = require('../apis/chuckNorris/chuckNorris.js');

// ============================================
// Example 1: Fetch a Single Random Joke
// ============================================
async function example1_randomJoke() {
    console.log('\n--- Example 1: Single Random Joke ---');
    try {
        const joke = await chuckNorrisAPI.getRandomJoke();
        console.log('Joke:', joke.value);
        console.log('ID:', joke.id);
        console.log('Categories:', joke.categories.length > 0 ? joke.categories.join(', ') : 'general');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ============================================
// Example 2: Fetch Multiple Random Jokes
// ============================================
async function example2_multipleJokes() {
    console.log('\n--- Example 2: Get 5 Random Jokes ---');
    try {
        const jokes = await chuckNorrisAPI.getRandomJokes(5);
        jokes.forEach((joke, index) => {
            console.log(`\n${index + 1}. ${joke.value}`);
        });
        console.log(`\nTotal fetched: ${jokes.length}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ============================================
// Example 3: Search for Jokes by Keyword
// ============================================
async function example3_searchJokes() {
    console.log('\n--- Example 3: Search for "developer" ---');
    try {
        const results = await chuckNorrisAPI.searchJokes('developer');
        console.log(`Found ${results.total} jokes about "developer"`);
        console.log('\nFirst 3 results:');
        results.result.slice(0, 3).forEach((joke, index) => {
            console.log(`${index + 1}. ${joke.value}`);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ============================================
// Example 4: Fetch Jokes by Category
// ============================================
async function example4_categoryJokes() {
    console.log('\n--- Example 4: Jokes by Category ---');
    try {
        // First, get all available categories
        const categories = await chuckNorrisAPI.getCategories();
        console.log(`Available categories (${categories.length}):`, categories.join(', '));

        // Fetch a random joke from a specific category
        const categoryName = categories[0]; // Get first category
        const joke = await chuckNorrisAPI.getJokeByCategory(categoryName);
        console.log(`\nRandom joke from "${categoryName}" category:`);
        console.log(joke.value);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ============================================
// Example 5: Fetch Joke by Specific ID
// ============================================
async function example5_jokeById() {
    console.log('\n--- Example 5: Joke by ID ---');
    try {
        // First get a random joke to get an ID
        const randomJoke = await chuckNorrisAPI.getRandomJoke();
        const jokeId = randomJoke.id;

        // Now fetch that specific joke by ID
        const joke = await chuckNorrisAPI.getJokeById(jokeId);
        console.log(`Fetched joke with ID ${jokeId}:`);
        console.log(joke.value);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ============================================
// Example 6: Advanced - Multiple Searches
// ============================================
async function example6_advancedSearch() {
    console.log('\n--- Example 6: Advanced Search ---');
    try {
        const keywords = ['funny', 'programming', 'technology'];
        
        for (const keyword of keywords) {
            const results = await chuckNorrisAPI.searchJokes(keyword);
            console.log(`\nKeyword: "${keyword}" - Found ${results.total} jokes`);
            if (results.result.length > 0) {
                console.log(`First: ${results.result[0].value}`);
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ============================================
// Example 7: Error Handling
// ============================================
async function example7_errorHandling() {
    console.log('\n--- Example 7: Error Handling ---');
    
    // Invalid joke ID
    try {
        console.log('Attempting invalid operation...');
        await chuckNorrisAPI.getJokeById(null);
    } catch (error) {
        console.log('✓ Caught error:', error.message);
    }

    // Invalid count for multiple jokes
    try {
        await chuckNorrisAPI.getRandomJokes(100);
    } catch (error) {
        console.log('✓ Caught error:', error.message);
    }

    // Empty search query
    try {
        await chuckNorrisAPI.searchJokes('');
    } catch (error) {
        console.log('✓ Caught error:', error.message);
    }
}

// ============================================
// Run Examples
// ============================================
(async () => {
    console.log('Chuck Norris Jokes API - Node.js Examples');
    console.log('==========================================');

    // Uncomment individual examples to run them
    await example1_randomJoke();
    await example2_multipleJokes();
    await example3_searchJokes();
    await example4_categoryJokes();
    await example5_jokeById();
    await example6_advancedSearch();
    await example7_errorHandling();

    console.log('\n==========================================');
    console.log('All examples completed!');
})();

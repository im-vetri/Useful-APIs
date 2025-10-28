/**
 * URL Shortener API
 * Shorten long URLs using TinyURL service
 * 
 * @author Useful-APIs Contributors
 * @version 1.0.0
 */

const TINYURL_API = "https://tinyurl.com/api-create.php";

/**
 * Shortens a URL
 * @param {string} url - Long URL to shorten
 * @returns {Promise<Object>} Shortened URL data
 */
async function shortenURL(url) {
    try {
        if (!url || typeof url !== 'string') {
            throw new Error('URL must be a non-empty string');
        }

        if (!isValidURL(url)) {
            throw new Error('Invalid URL format');
        }

        const response = await fetch(`${TINYURL_API}?url=${encodeURIComponent(url)}`);

        if (!response.ok) {
            throw new Error(`Failed to shorten URL: ${response.status}`);
        }

        const shortUrl = await response.text();

        if (!shortUrl || shortUrl.includes('error')) {
            throw new Error('Failed to create shortened URL');
        }

        return {
            originalUrl: url,
            shortUrl: shortUrl.trim(),
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error shortening URL:', error);
        throw error;
    }
}

/**
 * Shortens multiple URLs
 * @param {string[]} urls - Array of URLs to shorten
 * @returns {Promise<Array>} Array of shortened URLs
 */
async function shortenMultipleURLs(urls) {
    try {
        if (!Array.isArray(urls) || urls.length === 0) {
            throw new Error('URLs must be a non-empty array');
        }

        const results = [];
        for (const url of urls) {
            const shortened = await shortenURL(url);
            results.push(shortened);
        }
        return results;
    } catch (error) {
        console.error('Error shortening multiple URLs:', error);
        throw error;
    }
}

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid
 */
function isValidURL(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Gets URL information
 * @param {string} url - URL to analyze
 * @returns {Object} URL components and statistics
 */
function getURLInfo(url) {
    if (!isValidURL(url)) {
        throw new Error('Invalid URL format');
    }

    const urlObj = new URL(url);

    return {
        original: url,
        length: url.length,
        protocol: urlObj.protocol.replace(':', ''),
        hostname: urlObj.hostname,
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash,
        needsShortening: url.length > 50
    };
}

/**
 * Extracts domain from URL
 * @param {string} url - URL to parse
 * @returns {string} Domain name
 */
function extractDomain(url) {
    if (!isValidURL(url)) {
        throw new Error('Invalid URL format');
    }

    return new URL(url).hostname;
}

/**
 * Gets URL statistics
 * @param {string[]} urls - Array of URLs
 * @returns {Object} Statistics about the URLs
 */
function getURLStatistics(urls) {
    if (!Array.isArray(urls)) {
        throw new Error('URLs must be an array');
    }

    const validUrls = urls.filter(url => isValidURL(url));
    const invalidUrls = urls.filter(url => !isValidURL(url));
    const avgLength = validUrls.length > 0 
        ? (validUrls.reduce((sum, url) => sum + url.length, 0) / validUrls.length).toFixed(2)
        : 0;

    return {
        total: urls.length,
        valid: validUrls.length,
        invalid: invalidUrls.length,
        averageLength: avgLength,
        longestUrl: validUrls.length > 0 ? validUrls.reduce((max, url) => url.length > max.length ? url : max) : null,
        shortestUrl: validUrls.length > 0 ? validUrls.reduce((min, url) => url.length < min.length ? url : min) : null
    };
}

// Export for Node.js and Browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        shortenURL,
        shortenMultipleURLs,
        isValidURL,
        getURLInfo,
        extractDomain,
        getURLStatistics
    };
}

if (typeof window !== 'undefined') {
    window.urlShortenerAPI = {
        shortenURL,
        shortenMultipleURLs,
        isValidURL,
        getURLInfo,
        extractDomain,
        getURLStatistics
    };
}

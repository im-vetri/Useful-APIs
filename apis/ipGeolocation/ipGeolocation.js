/**
 * IP Geolocation API
 * Get location data from IP addresses using ip-api.com
 * 
 * @author Useful-APIs Contributors
 * @version 1.0.0
 */

const BASE_URL = "http://ip-api.com/json";

/**
 * Gets geolocation data for an IP address
 * @param {string} ipAddress - IP address to geolocate (omit for your own IP)
 * @returns {Promise<Object>} Location data including country, city, coordinates
 */
async function getLocation(ipAddress = null) {
    try {
        let url = BASE_URL;
        if (ipAddress) {
            if (typeof ipAddress !== 'string') {
                throw new Error('IP address must be a string');
            }
            url += `?query=${encodeURIComponent(ipAddress)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch geolocation data: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'fail') {
            throw new Error(data.message || 'Geolocation lookup failed');
        }

        return {
            ip: data.query,
            country: data.country,
            countryCode: data.countryCode,
            city: data.city,
            state: data.region,
            postal: data.zip,
            latitude: data.lat,
            longitude: data.lon,
            timezone: data.timezone,
            isp: data.isp,
            org: data.org,
            continent: data.continent,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error fetching geolocation:', error);
        throw error;
    }
}

/**
 * Gets location data for multiple IP addresses
 * @param {string[]} ipAddresses - Array of IP addresses
 * @returns {Promise<Array>} Array of location data
 */
async function getMultipleLocations(ipAddresses) {
    try {
        if (!Array.isArray(ipAddresses) || ipAddresses.length === 0) {
            throw new Error('ipAddresses must be a non-empty array');
        }

        const results = [];
        for (const ip of ipAddresses) {
            const location = await getLocation(ip);
            results.push(location);
        }
        return results;
    } catch (error) {
        console.error('Error fetching multiple locations:', error);
        throw error;
    }
}

/**
 * Gets your own IP address and location
 * @returns {Promise<Object>} Your IP and location data
 */
async function getMyLocation() {
    try {
        return await getLocation();
    } catch (error) {
        console.error('Error fetching your location:', error);
        throw error;
    }
}

/**
 * Calculates distance between two coordinates in kilometers
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
}

/**
 * Checks if an IP is private (RFC 1918)
 * @param {string} ipAddress - IP address to check
 * @returns {boolean} True if IP is private
 */
function isPrivateIP(ipAddress) {
    const privateRanges = [
        /^10\./,
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
        /^192\.168\./,
        /^127\./,
        /^::1$/,
        /^fc00:/i
    ];
    return privateRanges.some(range => range.test(ipAddress));
}

// Export for Node.js and Browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getLocation,
        getMultipleLocations,
        getMyLocation,
        calculateDistance,
        isPrivateIP
    };
}

if (typeof window !== 'undefined') {
    window.ipGeolocationAPI = {
        getLocation,
        getMultipleLocations,
        getMyLocation,
        calculateDistance,
        isPrivateIP
    };
}

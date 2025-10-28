/**
 * Weather API
 * Real-time weather data using Open-Meteo API (no API key required)
 * 
 * @author Useful-APIs Contributors
 * @version 1.0.0
 */

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Gets weather for a specific location by latitude and longitude
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @param {Object} options - Additional options (units, timezone, etc)
 * @returns {Promise<Object>} Weather data including current, hourly, and daily forecasts
 */
async function getWeatherByCoordinates(latitude, longitude, options = {}) {
    try {
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            throw new Error('Latitude and longitude must be valid numbers');
        }

        if (latitude < -90 || latitude > 90) {
            throw new Error('Latitude must be between -90 and 90');
        }

        if (longitude < -180 || longitude > 180) {
            throw new Error('Longitude must be between -180 and 180');
        }

        const {
            units = 'metric',
            timezone = 'auto',
            includeCurrent = true,
            includeHourly = true,
            includeDaily = true
        } = options;

        let url = `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&temperature_unit=${units === 'imperial' ? 'fahrenheit' : 'celsius'}`;
        
        url += `&timezone=${encodeURIComponent(timezone)}`;

        if (includeCurrent) {
            url += '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,weather_code,is_day';
        }

        if (includeHourly) {
            url += '&hourly=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m';
        }

        if (includeDaily) {
            url += '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max';
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch weather data: ${response.status}`);
        }

        const data = await response.json();
        return {
            location: { latitude, longitude },
            timezone: data.timezone,
            units: units,
            current: data.current || null,
            hourly: data.hourly || null,
            daily: data.daily || null,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error fetching weather by coordinates:', error);
        throw error;
    }
}

/**
 * Gets weather for a location by city name
 * @param {string} cityName - City name to search for
 * @param {Object} options - Additional options (country, units, etc)
 * @returns {Promise<Object>} Weather data for the city
 */
async function getWeatherByCity(cityName, options = {}) {
    try {
        if (!cityName || typeof cityName !== 'string') {
            throw new Error('City name must be a non-empty string');
        }

        // First, geocode the city name to get coordinates
        const location = await geocodeCity(cityName, options.country);

        if (!location) {
            throw new Error(`City "${cityName}" not found`);
        }

        // Then get weather for those coordinates
        const weather = await getWeatherByCoordinates(
            location.latitude,
            location.longitude,
            options
        );

        weather.location.name = location.name;
        weather.location.country = location.country;
        weather.location.admin1 = location.admin1;

        return weather;
    } catch (error) {
        console.error('Error fetching weather by city:', error);
        throw error;
    }
}

/**
 * Gets current weather only (no forecast)
 * @param {string} cityName - City name or "latitude,longitude"
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Current weather data only
 */
async function getCurrentWeather(cityName, options = {}) {
    try {
        if (!cityName || typeof cityName !== 'string') {
            throw new Error('City name must be a non-empty string');
        }

        // Check if it's coordinates format "lat,lng"
        const coordMatch = cityName.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);

        let weather;
        if (coordMatch) {
            weather = await getWeatherByCoordinates(
                parseFloat(coordMatch[1]),
                parseFloat(coordMatch[2]),
                { ...options, includeHourly: false, includeDaily: false }
            );
        } else {
            weather = await getWeatherByCity(cityName, { ...options, includeHourly: false, includeDaily: false });
        }

        return weather;
    } catch (error) {
        console.error('Error fetching current weather:', error);
        throw error;
    }
}

/**
 * Geocodes a city name to get coordinates
 * @param {string} cityName - City name to geocode
 * @param {string} country - Optional country code filter
 * @returns {Promise<Object>} Location data with coordinates
 */
async function geocodeCity(cityName, country = null) {
    try {
        if (!cityName || typeof cityName !== 'string') {
            throw new Error('City name must be a non-empty string');
        }

        let url = `${GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=1&language=en`;

        if (country) {
            url += `&country=${encodeURIComponent(country)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Geocoding failed: ${response.status}`);
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return null;
        }

        const result = data.results[0];
        return {
            name: result.name,
            country: result.country,
            admin1: result.admin1 || null,
            latitude: result.latitude,
            longitude: result.longitude
        };
    } catch (error) {
        console.error('Error geocoding city:', error);
        throw error;
    }
}

/**
 * Interprets WMO weather code to readable description
 * @param {number} code - WMO weather code
 * @param {boolean} isDay - Whether it's day or night
 * @returns {string} Weather description
 */
function getWeatherDescription(code, isDay = true) {
    const descriptions = {
        0: 'Clear sky',
        1: isDay ? 'Mainly clear' : 'Mainly clear (night)',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };

    return descriptions[code] || 'Unknown';
}

/**
 * Converts Celsius to Fahrenheit
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} Temperature in Fahrenheit
 */
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

/**
 * Converts Fahrenheit to Celsius
 * @param {number} fahrenheit - Temperature in Fahrenheit
 * @returns {number} Temperature in Celsius
 */
function fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
}

// Export for Node.js and Browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getWeatherByCoordinates,
        getWeatherByCity,
        getCurrentWeather,
        geocodeCity,
        getWeatherDescription,
        celsiusToFahrenheit,
        fahrenheitToCelsius
    };
}

if (typeof window !== 'undefined') {
    window.weatherAPI = {
        getWeatherByCoordinates,
        getWeatherByCity,
        getCurrentWeather,
        geocodeCity,
        getWeatherDescription,
        celsiusToFahrenheit,
        fahrenheitToCelsius
    };
}

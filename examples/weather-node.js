// Weather API - Node.js Examples
// Run individual examples by uncommenting them

const {
    getCurrentWeather,
    getWeatherByCity,
    getWeatherByCoordinates,
    geocodeCity,
    getWeatherDescription,
    celsiusToFahrenheit,
    fahrenheitToCelsius
} = require('../apis/weather/weather.js');

// ============================================
// Example 1: Get Current Weather for a City
// ============================================
async function example1_currentWeather() {
    console.log('\n--- Example 1: Current Weather ---');
    try {
        const weather = await getCurrentWeather('London');
        const { location, current } = weather;
        
        console.log(`Location: ${location.name}, ${location.country}`);
        console.log(`Temperature: ${current.temperature_2m}°C`);
        console.log(`Feels Like: ${current.apparent_temperature}°C`);
        console.log(`Condition: ${getWeatherDescription(current.weather_code)}`);
        console.log(`Humidity: ${current.relative_humidity_2m}%`);
        console.log(`Wind Speed: ${current.wind_speed_10m} km/h`);
        console.log(`Time of Day: ${current.is_day === 1 ? 'Day' : 'Night'}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ============================================
// Example 2: Get Weather by Coordinates
// ============================================
async function example2_weatherByCoordinates() {
    console.log('\n--- Example 2: Weather by Coordinates ---');
    try {
        // New York coordinates
        const weather = await getWeatherByCoordinates(40.7128, -74.0060);
        
        console.log(`Coordinates: ${weather.location.latitude}, ${weather.location.longitude}`);
        console.log(`Timezone: ${weather.timezone}`);
        console.log(`Current Temperature: ${weather.current.temperature_2m}°C`);
        console.log(`Weather: ${getWeatherDescription(weather.current.weather_code)}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ============================================
// Example 3: Get 7-Day Forecast
// ============================================
async function example3_weeklyForecast() {
    console.log('\n--- Example 3: 7-Day Forecast ---');
    try {
        const weather = await getWeatherByCity('Paris');
        const { location, daily } = weather;
        
        console.log(`\n7-Day Forecast for ${location.name}:\n`);
        console.log('Date | Weather | High/Low | Precip');
        console.log('-----|---------|----------|-------');
        
        daily.time.forEach((date, index) => {
            const description = getWeatherDescription(daily.weather_code[index]);
            const max = daily.temperature_2m_max[index];
            const min = daily.temperature_2m_min[index];
            const precip = daily.precipitation_sum[index];
            
            console.log(
                `${date} | ${description.padEnd(7)} | ${max}/${min}°C | ${precip}mm`
            );
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ============================================
// Example 4: Hourly Forecast
// ============================================
async function example4_hourlyForecast() {
    console.log('\n--- Example 4: Next 24 Hours Forecast ---');
    try {
        const weather = await getWeatherByCity('Tokyo');
        const { hourly } = weather;
        
        console.log(`\nNext 24 Hours for ${weather.location.name}:\n`);
        console.log('Hour | Temp | Humidity | Wind');
        console.log('-----|------|----------|------');
        
        for (let i = 0; i < 24; i++) {
            const hour = String(i).padStart(2, '0');
            const temp = hourly.temperature_2m[i];
            const humidity = hourly.relative_humidity_2m[i];
            const wind = hourly.wind_speed_10m[i];
            
            console.log(`${hour}:00 | ${temp.toFixed(1)}°C | ${humidity}% | ${wind} km/h`);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ============================================
// Example 5: Temperature Unit Conversion
// ============================================
async function example5_temperatureConversion() {
    console.log('\n--- Example 5: Temperature Conversion ---');
    try {
        const weather = await getCurrentWeather('Berlin', { units: 'metric' });
        const tempC = weather.current.temperature_2m;
        const tempF = celsiusToFahrenheit(tempC);
        
        console.log(`${weather.location.name}:`);
        console.log(`Celsius: ${tempC}°C`);
        console.log(`Fahrenheit: ${tempF.toFixed(1)}°F`);
        console.log(`Apparent Celsius: ${weather.current.apparent_temperature}°C`);
        console.log(`Apparent Fahrenheit: ${celsiusToFahrenheit(weather.current.apparent_temperature).toFixed(1)}°F`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ============================================
// Example 6: Multi-City Weather Comparison
// ============================================
async function example6_multiCityComparison() {
    console.log('\n--- Example 6: Weather Comparison Across Cities ---');
    try {
        const cities = ['London', 'Paris', 'Berlin', 'Amsterdam', 'Barcelona'];
        
        console.log('\nCurrent Weather Comparison:\n');
        console.log('City | Temp | Condition | Humidity | Wind');
        console.log('-----|------|-----------|----------|------');
        
        for (const city of cities) {
            const weather = await getCurrentWeather(city);
            const { current, location } = weather;
            const condition = getWeatherDescription(current.weather_code);
            
            console.log(
                `${location.name.padEnd(10)} | ${current.temperature_2m.toFixed(1)}°C | ${condition.padEnd(9)} | ${current.relative_humidity_2m}% | ${current.wind_speed_10m} km/h`
            );
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ============================================
// Example 7: Geocoding - City to Coordinates
// ============================================
async function example7_geocoding() {
    console.log('\n--- Example 7: Geocoding (City to Coordinates) ---');
    try {
        const cities = ['Sydney', 'Tokyo', 'Dubai', 'New York', 'Mumbai'];
        
        console.log('\nCity Coordinates:\n');
        
        for (const city of cities) {
            const location = await geocodeCity(city);
            console.log(`${city.padEnd(15)} | Lat: ${location.latitude.toFixed(4)} | Lng: ${location.longitude.toFixed(4)} | ${location.country}`);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ============================================
// Example 8: Weather Code Interpretation
// ============================================
async function example8_weatherCodes() {
    console.log('\n--- Example 8: Weather Code Interpretation ---');
    
    const weatherCodes = [0, 1, 3, 45, 51, 61, 71, 80, 95];
    
    console.log('\nWMO Weather Codes:\n');
    console.log('Code | Daytime Description | Nighttime Description');
    console.log('-----|---------------------|---------------------');
    
    weatherCodes.forEach(code => {
        const dayDesc = getWeatherDescription(code, true);
        const nightDesc = getWeatherDescription(code, false);
        console.log(`${code.toString().padStart(4)} | ${dayDesc.padEnd(19)} | ${nightDesc}`);
    });
}

// ============================================
// Example 9: Rain Forecast for a Week
// ============================================
async function example9_rainForecast() {
    console.log('\n--- Example 9: Weekly Rain Forecast ---');
    try {
        const weather = await getWeatherByCity('Seattle');
        const { daily, location } = weather;
        
        console.log(`\nRain Forecast for ${location.name}:\n`);
        console.log('Date | Precipitation | Weather');
        console.log('-----|----------------|--------');
        
        daily.time.forEach((date, index) => {
            const precip = daily.precipitation_sum[index];
            const description = getWeatherDescription(daily.weather_code[index]);
            
            // Highlight rainy days
            const rainStatus = precip > 0 ? '🌧️ ' : '   ';
            console.log(`${date} | ${rainStatus}${precip.toFixed(1)}mm | ${description}`);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ============================================
// Example 10: Error Handling
// ============================================
async function example10_errorHandling() {
    console.log('\n--- Example 10: Error Handling ---');
    
    // Invalid city
    try {
        await getCurrentWeather('InvalidCityXYZ12345');
    } catch (error) {
        console.log('✓ Caught error (invalid city):', error.message);
    }

    // Invalid coordinates
    try {
        await getWeatherByCoordinates(91, 0); // Invalid latitude
    } catch (error) {
        console.log('✓ Caught error (invalid latitude):', error.message);
    }

    // Invalid longitude
    try {
        await getWeatherByCoordinates(0, 200); // Invalid longitude
    } catch (error) {
        console.log('✓ Caught error (invalid longitude):', error.message);
    }
}

// ============================================
// Run Examples
// ============================================
(async () => {
    console.log('Weather API - Node.js Examples');
    console.log('================================');

    // Uncomment individual examples to run them
    await example1_currentWeather();
    await example2_weatherByCoordinates();
    await example3_weeklyForecast();
    await example4_hourlyForecast();
    await example5_temperatureConversion();
    await example6_multiCityComparison();
    await example7_geocoding();
    await example8_weatherCodes();
    await example9_rainForecast();
    await example10_errorHandling();

    console.log('\n================================');
    console.log('All examples completed!');
})();

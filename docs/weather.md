# Weather API - Complete Documentation

## Overview

The Weather API provides real-time weather data and forecasts using Open-Meteo (no API key required). Get current conditions, hourly forecasts (168 hours), and 7-day daily forecasts.

**Base URLs**: 
- Weather: `https://api.open-meteo.com/v1/forecast`
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`

**Dependencies**: None (uses native Fetch API)

**Environments**: Browser and Node.js

## Installation

1. Copy `weather.js` to your project
2. Node.js: `const { getCurrentWeather, getWeatherByCity } = require('./weather.js');`
3. Browser: `<script src="weather.js"></script>`

## Function Reference

### getCurrentWeather(cityName, options)

Gets only current weather conditions for a city.

**Parameters**:
- `cityName` (string, required) - City name or "latitude,longitude" format
- `options` (Object, optional) - { units, timezone, country }

**Returns**: Promise<Object> - Current weather data only

**Example**:
```javascript
const weather = await weatherAPI.getCurrentWeather('London');
console.log(weather);
// Output:
// {
//   location: { latitude: 51.5085, longitude: -0.1257, name: 'London', country: 'United Kingdom' },
//   timezone: 'Europe/London',
//   units: 'metric',
//   current: {
//     temperature_2m: 12.5,
//     relative_humidity_2m: 68,
//     apparent_temperature: 11.2,
//     weather_code: 3,
//     wind_speed_10m: 15.3,
//     is_day: 1
//   },
//   timestamp: '2025-10-28T10:30:00.000Z'
// }
```

**Coordinate Format**:
```javascript
// Get weather for New York by coordinates
const weather = await weatherAPI.getCurrentWeather('40.7128,-74.0060');
```

---

### getWeatherByCity(cityName, options)

Gets full weather data including current conditions, hourly forecast (7 days), and daily forecast.

**Parameters**:
- `cityName` (string, required) - City name to search for
- `options` (Object, optional) - {
    - `units` (string): 'metric' (default) or 'imperial'
    - `timezone` (string): 'auto' (default) or specific timezone
    - `country` (string): Country code to filter results
    - `includeCurrent` (boolean): Include current weather (default: true)
    - `includeHourly` (boolean): Include hourly forecast (default: true)
    - `includeDaily` (boolean): Include daily forecast (default: true)
  }

**Returns**: Promise<Object> - Full weather data

**Example**:
```javascript
const weather = await weatherAPI.getWeatherByCity('Tokyo', { units: 'imperial' });
console.log(`Current: ${weather.current.temperature_2m}°F`);
console.log(`Forecast for tomorrow: ${weather.daily.temperature_2m_max[1]}°F`);
```

**Daily Forecast Data**:
```javascript
// Access 7-day forecast
weather.daily.time.forEach((date, index) => {
  const max = weather.daily.temperature_2m_max[index];
  const min = weather.daily.temperature_2m_min[index];
  const description = weatherAPI.getWeatherDescription(weather.daily.weather_code[index]);
  console.log(`${date}: ${max}°C / ${min}°C - ${description}`);
});
```

---

### getWeatherByCoordinates(latitude, longitude, options)

Gets weather data for specific GPS coordinates.

**Parameters**:
- `latitude` (number, required) - Location latitude (-90 to 90)
- `longitude` (number, required) - Location longitude (-180 to 180)
- `options` (Object, optional) - Same as getWeatherByCity

**Returns**: Promise<Object> - Weather data

**Example**:
```javascript
// Get weather for Sydney, Australia
const weather = await weatherAPI.getWeatherByCoordinates(-33.8688, 151.2093);
console.log(`Sydney: ${weather.current.temperature_2m}°C`);
```

**Validation**:
```javascript
try {
  await weatherAPI.getWeatherByCoordinates(91, 0); // Invalid latitude
} catch (error) {
  console.error(error.message); // "Latitude must be between -90 and 90"
}
```

---

### geocodeCity(cityName, countryCode)

Converts city name to GPS coordinates and location info.

**Parameters**:
- `cityName` (string, required) - City name to search for
- `countryCode` (string, optional) - ISO country code to filter (e.g., 'US', 'GB', 'JP')

**Returns**: Promise<Object> - Location data with coordinates

**Example**:
```javascript
const location = await weatherAPI.geocodeCity('Paris', 'FR');
console.log(location);
// Output:
// {
//   name: 'Paris',
//   country: 'France',
//   admin1: 'Île-de-France',
//   latitude: 48.8566,
//   longitude: 2.3522
// }
```

**Multiple Results Handling**:
```javascript
// Returns the first (most relevant) result
const location = await weatherAPI.geocodeCity('Springfield');
// Note: If multiple cities exist, you'll get the most relevant one
```

---

### getWeatherDescription(weatherCode, isDay)

Converts WMO weather code to readable description.

**Parameters**:
- `weatherCode` (number, required) - WMO weather code (0-99)
- `isDay` (boolean, optional) - Whether it's daytime (default: true)

**Returns**: String - Weather description

**Example**:
```javascript
const code = 3;
const description = weatherAPI.getWeatherDescription(code, true);
console.log(description); // "Overcast"

// Use with weather data
const weather = await weatherAPI.getCurrentWeather('Berlin');
const description = weatherAPI.getWeatherDescription(weather.current.weather_code);
console.log(`Current weather: ${description}`);
```

**Common Weather Codes**:

| Code | Description |
|------|-------------|
| 0 | Clear sky |
| 1-3 | Cloudy/Overcast |
| 45-48 | Foggy |
| 51-55 | Drizzle |
| 61-65 | Rain |
| 71-75 | Snow |
| 80-82 | Rain showers |
| 85-86 | Snow showers |
| 95-99 | Thunderstorm |

---

### celsiusToFahrenheit(celsius)

Converts temperature from Celsius to Fahrenheit.

**Parameters**:
- `celsius` (number, required) - Temperature in Celsius

**Returns**: Number - Temperature in Fahrenheit

**Example**:
```javascript
const tempC = 20;
const tempF = weatherAPI.celsiusToFahrenheit(tempC);
console.log(`${tempC}°C = ${tempF}°F`); // "20°C = 68°F"
```

---

### fahrenheitToCelsius(fahrenheit)

Converts temperature from Fahrenheit to Celsius.

**Parameters**:
- `fahrenheit` (number, required) - Temperature in Fahrenheit

**Returns**: Number - Temperature in Celsius

**Example**:
```javascript
const tempF = 72;
const tempC = weatherAPI.fahrenheitToCelsius(tempF);
console.log(`${tempF}°F = ${tempC}°C`); // "72°F = 22.2°C"
```

---

## Error Handling

All functions return rejected promises on error.

| Error | Cause | Solution |
|-------|-------|----------|
| "City not found" | Invalid city name | Check spelling, try with country |
| "Latitude must be between -90 and 90" | Invalid latitude | Use valid latitude value |
| "Longitude must be between -180 and 180" | Invalid longitude | Use valid longitude value |
| "Geocoding failed" | API error | Check internet connection |
| "Failed to fetch weather data" | API error | Check coordinates are valid |

**Error Handling Example**:
```javascript
try {
  const weather = await weatherAPI.getWeatherByCity('InvalidCity');
} catch (error) {
  console.error('Weather fetch failed:', error.message);
  // Use cached data or default values
}
```

---

## Usage Examples

### Simple Weather Display
```javascript
async function displayWeather(cityName) {
  const weather = await weatherAPI.getCurrentWeather(cityName);
  const { location, current } = weather;
  
  console.log(`${location.name}, ${location.country}`);
  console.log(`Temperature: ${current.temperature_2m}°C`);
  console.log(`Humidity: ${current.relative_humidity_2m}%`);
  console.log(`Wind: ${current.wind_speed_10m} km/h`);
}

displayWeather('Paris');
```

### 7-Day Forecast
```javascript
async function getWeeklyForecast(cityName) {
  const weather = await weatherAPI.getWeatherByCity(cityName);
  const { daily } = weather;
  
  console.log(`\n7-Day Forecast for ${weather.location.name}:\n`);
  daily.time.forEach((date, index) => {
    const code = daily.weather_code[index];
    const description = weatherAPI.getWeatherDescription(code);
    const max = daily.temperature_2m_max[index];
    const min = daily.temperature_2m_min[index];
    const rain = daily.precipitation_sum[index];
    
    console.log(`${date}: ${description}`);
    console.log(`  High/Low: ${max}°C / ${min}°C`);
    console.log(`  Precipitation: ${rain}mm\n`);
  });
}
```

### Hourly Forecast
```javascript
async function getNextDay(cityName) {
  const weather = await weatherAPI.getWeatherByCity(cityName);
  const { hourly } = weather;
  
  console.log('Next 24 Hours:\n');
  for (let i = 0; i < 24; i++) {
    const temp = hourly.temperature_2m[i];
    const humidity = hourly.relative_humidity_2m[i];
    const wind = hourly.wind_speed_10m[i];
    
    console.log(`${i}:00 - ${temp}°C, ${humidity}% humidity, ${wind} km/h wind`);
  }
}
```

### Multi-City Weather Comparison
```javascript
async function compareWeather(cities) {
  const results = {};
  
  for (const city of cities) {
    const weather = await weatherAPI.getCurrentWeather(city);
    results[city] = {
      temp: weather.current.temperature_2m,
      description: weatherAPI.getWeatherDescription(weather.current.weather_code)
    };
  }
  
  return results;
}

compareWeather(['London', 'Paris', 'Berlin', 'Amsterdam']);
```

### Temperature Unit Conversion
```javascript
async function displayBothUnits(cityName) {
  const weatherC = await weatherAPI.getWeatherByCity(cityName, { units: 'metric' });
  const tempF = weatherAPI.celsiusToFahrenheit(weatherC.current.temperature_2m);
  
  console.log(`${weatherC.location.name}:`);
  console.log(`${weatherC.current.temperature_2m}°C / ${tempF}°F`);
}
```

---

## Current Weather Response Structure

```javascript
{
  location: {
    latitude: number,
    longitude: number,
    name: string,
    country: string,
    admin1: string
  },
  timezone: string,
  units: 'metric' | 'imperial',
  current: {
    temperature_2m: number,
    relative_humidity_2m: number,
    apparent_temperature: number,
    weather_code: number,
    wind_speed_10m: number,
    is_day: number (0 or 1)
  },
  timestamp: ISO string
}
```

## Hourly Forecast Response

```javascript
{
  hourly: {
    time: string[],                    // ISO 8601 timestamps
    temperature_2m: number[],          // 168 values (7 days)
    relative_humidity_2m: number[],
    weather_code: number[],
    wind_speed_10m: number[]
  }
}
```

## Daily Forecast Response

```javascript
{
  daily: {
    time: string[],                    // Dates in YYYY-MM-DD format
    weather_code: number[],            // 7 values
    temperature_2m_max: number[],
    temperature_2m_min: number[],
    precipitation_sum: number[],       // mm
    wind_speed_10m_max: number[]       // km/h
  }
}
```

## Performance Considerations

- Each function makes 1-2 HTTP requests (geocoding + weather)
- Responses typically return within 200-500ms
- Hourly data: 168 values (7 days at 1-hour intervals)
- Daily data: 7 values (one week forecast)
- Consider caching results to reduce API calls
- No rate limiting on Open-Meteo free tier

## Browser Compatibility

- Chrome 40+
- Firefox 40+
- Safari 10+
- Edge 14+
- Node.js 14+

## License

MIT

# Weather API

Real-time weather data and forecasts using Open-Meteo API. No API key required. Get current conditions, hourly forecasts, and 7-day forecasts.

## Quick Start

### Browser
```html
<script src="weather.js"></script>

<script>
  // Get current weather for a city
  weatherAPI.getCurrentWeather('London')
    .then(weather => {
      console.log(`${weather.location.name}: ${weather.current.temperature_2m}°C`);
    })
    .catch(error => console.error(error));
</script>
```

### Node.js
```javascript
const { getCurrentWeather, getWeatherByCity } = require('./weather.js');

// Get current weather
getCurrentWeather('Tokyo')
  .then(weather => {
    console.log(`${weather.location.name}: ${weather.current.temperature_2m}°C`);
  })
  .catch(error => console.error(error));
```

## API Functions

| Function | Parameters | Description |
|----------|-----------|-------------|
| `getCurrentWeather(city)` | city name or "lat,lng" | Get current weather only |
| `getWeatherByCity(city, options)` | city name, options | Get full weather data including forecast |
| `getWeatherByCoordinates(lat, lng, options)` | latitude, longitude | Get weather by GPS coordinates |
| `geocodeCity(city, country)` | city name, country code | Convert city name to coordinates |
| `getWeatherDescription(code, isDay)` | WMO code, is day | Get readable weather description |
| `celsiusToFahrenheit(celsius)` | temperature | Convert temperature units |
| `fahrenheitToCelsius(fahrenheit)` | temperature | Convert temperature units |

## Supported Units

- **Metric**: Celsius, km/h (default)
- **Imperial**: Fahrenheit, mph

## Response Format

### Current Weather
```javascript
{
  current: {
    temperature_2m: 15.2,
    relative_humidity_2m: 72,
    apparent_temperature: 13.5,
    weather_code: 3,
    wind_speed_10m: 12.5,
    is_day: 1
  }
}
```

### Daily Forecast
```javascript
{
  daily: {
    time: ["2025-10-28", "2025-10-29", ...],
    weather_code: [3, 63, 2, ...],
    temperature_2m_max: [18, 15, 20, ...],
    temperature_2m_min: [10, 8, 12, ...],
    precipitation_sum: [0, 5.2, 0, ...]
  }
}
```

## Examples

### Get Weather by City
```javascript
const weather = await weatherAPI.getWeatherByCity('Paris');
console.log(`${weather.location.name}, ${weather.location.country}`);
console.log(`Temperature: ${weather.current.temperature_2m}°C`);
console.log(`Weather: ${weatherAPI.getWeatherDescription(weather.current.weather_code)}`);
```

### Get Weather by Coordinates
```javascript
const weather = await weatherAPI.getWeatherByCoordinates(40.7128, -74.0060);
console.log(`Current: ${weather.current.temperature_2m}°C`);
```

### Get 7-Day Forecast
```javascript
const weather = await weatherAPI.getWeatherByCity('Berlin');
weather.daily.time.forEach((date, index) => {
  console.log(`${date}: ${weather.daily.temperature_2m_max[index]}°C / ${weather.daily.temperature_2m_min[index]}°C`);
});
```

## License

MIT

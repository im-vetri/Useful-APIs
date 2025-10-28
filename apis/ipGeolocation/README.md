# IP Geolocation API

Get geolocation data from IP addresses. Find out country, city, coordinates, timezone, and ISP information.

## Quick Start

### Browser
```html
<script src="ipGeolocation.js"></script>

<script>
  // Get location for an IP
  ipGeolocationAPI.getLocation('8.8.8.8')
    .then(location => {
      console.log(`${location.city}, ${location.country}`);
      console.log(`Coordinates: ${location.latitude}, ${location.longitude}`);
    })
    .catch(error => console.error(error));
</script>
```

### Node.js
```javascript
const { getLocation, getMyLocation } = require('./ipGeolocation.js');

// Get your own location
getMyLocation()
  .then(location => {
    console.log(`Your location: ${location.city}, ${location.country}`);
  })
  .catch(error => console.error(error));
```

## API Functions

| Function | Description |
|----------|-------------|
| `getLocation(ip)` | Get location data for an IP (omit for your own) |
| `getMyLocation()` | Get your own IP and location |
| `getMultipleLocations(ips[])` | Lookup multiple IPs at once |
| `calculateDistance(lat1, lon1, lat2, lon2)` | Distance between two coordinates in km |
| `isPrivateIP(ip)` | Check if IP is private (RFC 1918) |

## Response Format

```javascript
{
  ip: "8.8.8.8",
  country: "United States",
  countryCode: "US",
  city: "Mountain View",
  state: "California",
  postal: "94043",
  latitude: 37.4192,
  longitude: -122.0574,
  timezone: "America/Los_Angeles",
  isp: "Google LLC",
  org: "GOOGLE",
  continent: "North America",
  timestamp: "2025-10-28T10:30:00.000Z"
}
```

## Examples

### Get Location by IP
```javascript
const location = await ipGeolocationAPI.getLocation('1.1.1.1');
console.log(`${location.city}, ${location.country}`);
```

### Calculate Distance Between Two IPs
```javascript
const ip1 = await ipGeolocationAPI.getLocation('8.8.8.8');
const ip2 = await ipGeolocationAPI.getLocation('1.1.1.1');
const distance = ipGeolocationAPI.calculateDistance(
  ip1.latitude, ip1.longitude, 
  ip2.latitude, ip2.longitude
);
console.log(`Distance: ${distance} km`);
```

## License

MIT

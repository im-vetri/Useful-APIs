# Distance & Route API

Helpers for calculating distances, building distance matrices, optimizing routes and estimating travel time. Uses Google Distance Matrix / Directions, OpenRouteService (ORS) or OSRM (public demo) with a Haversine fallback when provider access is not available.

## Quick Start

### Browser
```html
<script src="distance_and_route.js"></script>

<script>
  // Calculate distance between two points
  // Points: { lat, lng } or [lat, lng]
  DistanceRouteAPI.calculateDistance({ lat: 37.7749, lng: -122.4194 }, { lat: 34.0522, lng: -118.2437 })
    .then(res => console.log('meters:', res.distance, 'duration(s):', res.duration))
    .catch(err => console.error(err));
</script>
```

### Node.js
```javascript
const DistanceRouteAPI = require('./distance_and_route.js');

(async () => {
  const a = { lat: 37.7749, lng: -122.4194 };
  const b = { lat: 34.0522, lng: -118.2437 };

  // distance + estimated travel time (uses provider keys if provided)
  const d = await DistanceRouteAPI.calculateDistance(a, b, { provider: 'auto', googleApiKey: process.env.GOOGLE_KEY });
  console.log(d);

  // distance matrix for multiple points
  const pts = [a, b, { lat: 36.1699, lng: -115.1398 }];
  const matrix = await DistanceRouteAPI.getDistanceMatrix(pts, { openRouteServiceApiKey: process.env.ORS_KEY });
  console.log(matrix);
})();
```

## API Functions

| Function | Parameters | Description |
|----------|------------|-------------|
| `calculateDistance(a, b, options)` | `a, b` (point), `options` | Returns `{ distance (meters), duration (seconds?)?, unit }`. Uses Google/ORS/OSRM if API key provided, otherwise Haversine fallback. |
| `getDistanceMatrix(points, options)` | `points` (array of points), `options` | Returns `{ distances: NxN, durations: NxN, unit }` using provider matrix endpoints or computed Haversine matrix. |
| `optimizeRoute(points, options)` | `points` (array), `options` | Attempts route optimization (Google Directions optimizeWaypoints, OSRM trip, ORS when available). Returns reordered waypoints, distance, duration and provider info. |
| `getEstimatedTime(a, b, options)` | `a, b`, `options` | Convenience wrapper returning estimated travel time in seconds (or null if unavailable). |
| `_haversine(a, b)` | internal helper | Straight-line distance in meters (exported for convenience/testing). |

## Usage Notes & Options

- options may include:
  - `provider`: 'google' | 'ors' | 'osrm' | 'auto' (default)
  - `googleApiKey`: API key for Google Distance Matrix / Directions
  - `openRouteServiceApiKey`: API key for OpenRouteService
  - `profile`: 'driving' | 'walking' | 'cycling'
  - `roundtrip`: boolean (for OSRM trip / route optimization)
- Input point formats accepted: { lat, lng } or { latitude, longitude } or [lat, lng] (assumes [lat, lng]).
- When provider keys are missing or provider endpoints fail, the module falls back to Haversine or OSRM public demo where possible.

## Example Outputs

- calculateDistance:
```json
{
  "distance": 559120.4,
  "duration": 19600,
  "unit": "meters"
}
```

- getDistanceMatrix (example):
```json
{
  "distances": [[0,559120,670000],[559120,0,410000],[670000,410000,0]],
  "durations": [[0,19600,23000],[19600,0,15000],[23000,15000,0]],
  "unit": "meters"
}
```

- optimizeRoute (example):
```json
{
  "waypoints": [{ "lat": 37.7, "lng": -122.4 }, { "lat": 36.1, "lng": -115.1 }, { "lat": 34.0, "lng": -118.2 }],
  "waypointsOrder": [0,2,1],
  "distance": 1200000,
  "duration": 42000,
  "provider": "osrm"
}
```

## Error Handling

All functions reject with descriptive errors on invalid input or provider failures. Example:
```js
DistanceRouteAPI.getDistanceMatrix([], {})
  .catch(err => console.error('Error:', err.message));
```

## Providers & Rate Limits

- Google Maps APIs: require API key and billing enabled for production use.
- OpenRouteService: requires API key. Some advanced endpoints may be rate-limited or restricted.
- OSRM: public demo server is available for light testing; do not rely on it for production.
- Respect provider usage policies and rate limits. Batch requests and cache results where appropriate.

## License

MIT
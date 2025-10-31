/**
 * Distance & Route Helpers
 * - Calculate distance between coordinates (Haversine fallback)
 * - Distance matrix for multiple points (Google Distance Matrix / OpenRouteService / OSRM fallback)
 * - Route optimization (Google Directions optimizeWaypoints / OSRM trip)
 * - Estimated travel time (using chosen provider)
 *
 * Provider selection:
 *  - If options.googleApiKey is provided, Google APIs will be used where applicable.
 *  - If options.openRouteServiceApiKey is provided, ORS endpoints will be used where applicable.
 *  - Otherwise the code will attempt to use the public OSRM demo server (no key).
 *  - Falls back to simple haversine distance when external provider is unavailable.
 *
 * Point format:
 *  - Preferred: { lat: number, lng: number }
 *  - Also accepts arrays: [lat, lng]
 *
 * NOTE: Respect provider rate limits and usage terms. OSRM public demo server is for light testing only.
 *
 * Example:
 *  const a = { lat: 37.7749, lng: -122.4194 };
 *  const b = { lat: 34.0522, lng: -118.2437 };
 *  const meters = await calculateDistance(a, b);
 *  const matrix = await getDistanceMatrix([a,b,c]);
 *  const optimized = await optimizeRoute(points);
 */

const GOOGLE_DISTANCE_MATRIX_URL = "https://maps.googleapis.com/maps/api/distancematrix/json";
const GOOGLE_DIRECTIONS_URL = "https://maps.googleapis.com/maps/api/directions/json";
const OSRM_BASE = "https://router.project-osrm.org"; // public demo; use responsibly
const ORS_MATRIX_URL = "https://api.openrouteservice.org/v2/matrix";
const ORS_DIRECTIONS_URL = "https://api.openrouteservice.org/v2/directions";

function _toPoint(p) {
    if (!p && p !== 0) return null;
    if (Array.isArray(p)) {
        // [lat,lng] or [lng,lat] ambiguity — assume [lat,lng]
        return { lat: Number(p[0]), lng: Number(p[1]) };
    }
    if (typeof p === "object") {
        if (p.lat !== undefined && p.lng !== undefined) return { lat: Number(p.lat), lng: Number(p.lng) };
        if (p.latitude !== undefined && p.longitude !== undefined) return { lat: Number(p.latitude), lng: Number(p.longitude) };
    }
    return null;
}

function _validatePoint(p, name = "point") {
    const pt = _toPoint(p);
    if (!pt || Number.isNaN(pt.lat) || Number.isNaN(pt.lng)) {
        throw new Error(`${name} must be an object {lat, lng} or [lat, lng] with numeric values`);
    }
    return pt;
}

function _toOsrmCoord(pt) {
    // OSRM requires lon,lat
    return `${pt.lng},${pt.lat}`;
}

function _toGoogleLatLng(pt) {
    return `${pt.lat},${pt.lng}`;
}

// Haversine distance (meters)
function _haversine(a, b) {
    const R = 6371000; // meters
    const toRad = (d) => (d * Math.PI) / 180;
    const φ1 = toRad(a.lat);
    const φ2 = toRad(b.lat);
    const Δφ = toRad(b.lat - a.lat);
    const Δλ = toRad(b.lng - a.lng);
    const sinΔφ = Math.sin(Δφ / 2);
    const sinΔλ = Math.sin(Δλ / 2);
    const h = sinΔφ * sinΔφ + Math.cos(φ1) * Math.cos(φ2) * sinΔλ * sinΔλ;
    const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    return R * c;
}

// simple fetch wrapper
async function _fetchJson(url, init = {}) {
    const res = await fetch(url, init);
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
    }
    return res.json();
}

/**
 * Calculate straight-line or routing distance between two points.
 * options:
 *  - provider: 'google'|'ors'|'osrm'|'auto' (default 'auto')
 *  - googleApiKey, openRouteServiceApiKey
 *  - profile (for ORS/OSRM): driving|walking|cycling — default driving
 * @returns {Promise<{ distance: number, duration?: number, unit: 'meters' }>} distance in meters, optional duration seconds if provider returns it
 */
async function calculateDistance(a, b, options = {}) {
    try {
        const A = _validatePoint(a, "point A");
        const B = _validatePoint(b, "point B");
        const provider = options.provider || "auto";
        const profile = (options.profile || "driving").toString();

        // Google Distance Matrix if key present and chosen
        if ((provider === "google" || provider === "auto") && options.googleApiKey) {
            const origins = _toGoogleLatLng(A);
            const destinations = _toGoogleLatLng(B);
            const url = `${GOOGLE_DISTANCE_MATRIX_URL}?units=metric&origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinations)}&key=${encodeURIComponent(options.googleApiKey)}`;
            const data = await _fetchJson(url);
            if (data.status !== "OK") throw new Error(`Google API error: ${data.status}`);
            const cell = (data.rows && data.rows[0] && data.rows[0].elements && data.rows[0].elements[0]) || {};
            if (cell.status !== "OK") throw new Error(`Google element error: ${cell.status || "no data"}`);
            return { distance: cell.distance.value, duration: cell.duration ? cell.duration.value : undefined, unit: "meters" };
        }

        // OpenRouteService matrix (if key)
        if ((provider === "ors" || provider === "openrouteservice" || provider === "auto") && options.openRouteServiceApiKey) {
            // ORS matrix expects [lng,lat]
            const locations = [[A.lng, A.lat], [B.lng, B.lat]];
            const body = { locations, metrics: ["distance", "duration"] };
            const resp = await _fetchJson(`${ORS_MATRIX_URL}/foot-walking`, {
                method: "POST",
                headers: { "Authorization": options.openRouteServiceApiKey, "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }).catch(async (err) => {
                // try driving profile if foot-walking fails
                return _fetchJson(`${ORS_MATRIX_URL}/${profile}`, {
                    method: "POST",
                    headers: { "Authorization": options.openRouteServiceApiKey, "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
            });
            // resp.distances is matrix NxN in meters
            const dist = (resp.distances && resp.distances[0] && resp.distances[0][1]) || _haversine(A, B);
            const dur = (resp.durations && resp.durations[0] && resp.durations[0][1]) || undefined;
            return { distance: dist, duration: dur, unit: "meters" };
        }

        // OSRM route (no key, public demo)
        if (provider === "osrm" || provider === "auto") {
            try {
                const coords = `${_toOsrmCoord(A)};${_toOsrmCoord(B)}`;
                const url = `${OSRM_BASE}/route/v1/${profile}/${coords}?overview=false&alternatives=false&annotations=distance,duration`;
                const data = await _fetchJson(url);
                if (data.code && data.code !== "Ok") throw new Error(`OSRM error: ${data.code}`);
                const route = (data.routes && data.routes[0]) || null;
                if (!route) throw new Error("No route returned by OSRM");
                return { distance: route.distance, duration: route.duration, unit: "meters" };
            } catch (err) {
                // fallthrough to haversine
            }
        }

        // Fallback: haversine straight-line distance
        return { distance: Math.round(_haversine(A, B)), unit: "meters" };
    } catch (error) {
        console.error("Error in calculateDistance:", error);
        throw error;
    }
}

/**
 * Get distance matrix for an array of points.
 * Returns { distances: NxN array (meters or null), durations: NxN array (seconds|null) }
 * options:
 *  - provider: 'google'|'ors'|'osrm'|'auto'
 *  - googleApiKey, openRouteServiceApiKey
 *  - profile: driving|walking|cycling
 */
async function getDistanceMatrix(points = [], options = {}) {
    try {
        if (!Array.isArray(points) || points.length < 2) throw new Error("points must be an array with at least two entries");
        const pts = points.map((p, i) => _validatePoint(p, `points[${i}]`));
        const provider = options.provider || "auto";
        const profile = (options.profile || "driving").toString();

        // Google Distance Matrix (batch)
        if ((provider === "google" || provider === "auto") && options.googleApiKey) {
            const origins = pts.map(_toGoogleLatLng).map(encodeURIComponent).join("|");
            const destinations = pts.map(_toGoogleLatLng).map(encodeURIComponent).join("|");
            const url = `${GOOGLE_DISTANCE_MATRIX_URL}?units=metric&origins=${origins}&destinations=${destinations}&key=${encodeURIComponent(options.googleApiKey)}`;
            const data = await _fetchJson(url);
            if (data.status !== "OK") throw new Error(`Google API error: ${data.status}`);
            const distances = [];
            const durations = [];
            for (let r = 0; r < data.rows.length; r++) {
                const row = data.rows[r];
                const dRow = [];
                const tRow = [];
                for (let c = 0; c < row.elements.length; c++) {
                    const elem = row.elements[c];
                    if (elem && elem.status === "OK") {
                        dRow.push(elem.distance.value);
                        tRow.push(elem.duration ? elem.duration.value : null);
                    } else {
                        dRow.push(null);
                        tRow.push(null);
                    }
                }
                distances.push(dRow);
                durations.push(tRow);
            }
            return { distances, durations, unit: "meters" };
        }

        // OpenRouteService matrix
        if ((provider === "ors" || provider === "openrouteservice" || provider === "auto") && options.openRouteServiceApiKey) {
            const locations = pts.map((p) => [p.lng, p.lat]);
            const body = { locations, metrics: ["distance", "duration"] };
            const url = `${ORS_MATRIX_URL}/${profile}`;
            const resp = await _fetchJson(url, {
                method: "POST",
                headers: { "Authorization": options.openRouteServiceApiKey, "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            // ORS returns distances (meters) and durations (seconds)
            return { distances: resp.distances || null, durations: resp.durations || null, unit: "meters" };
        }

        // OSRM table API
        if (provider === "osrm" || provider === "auto") {
            const coords = pts.map(_toOsrmCoord).join(";");
            const url = `${OSRM_BASE}/table/v1/${profile}/${coords}?annotations=distance,duration`;
            const data = await _fetchJson(url);
            if (data.code && data.code !== "Ok") throw new Error(`OSRM table error: ${data.code}`);
            // OSRM returns distances in meters and durations in seconds
            return { distances: data.distances || null, durations: data.durations || null, unit: "meters" };
        }

        // Fallback: compute haversine matrix
        const n = pts.length;
        const distances = Array.from({ length: n }, () => Array(n).fill(null));
        const durations = Array.from({ length: n }, () => Array(n).fill(null));
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i === j) {
                    distances[i][j] = 0;
                    durations[i][j] = 0;
                } else {
                    const d = Math.round(_haversine(pts[i], pts[j]));
                    distances[i][j] = d;
                    durations[i][j] = null;
                }
            }
        }
        return { distances, durations, unit: "meters" };
    } catch (error) {
        console.error("Error in getDistanceMatrix:", error);
        throw error;
    }
}

/**
 * Optimize a route (TSP) for given points.
 * Returns { waypoints: reorderedPoints, waypointsOrder: [indices], distance, duration, geometry? }
 * options:
 *  - provider: 'google'|'ors'|'osrm'|'auto'
 *  - googleApiKey, openRouteServiceApiKey
 *  - profile: driving|walking|cycling
 *  - roundtrip: boolean (OSRM trip supports roundtrip; Google optimizeWaypoints true optimizes intermediate waypoints)
 */
async function optimizeRoute(points = [], options = {}) {
    try {
        if (!Array.isArray(points) || points.length < 2) throw new Error("points must be an array with at least two entries");
        const pts = points.map((p, i) => _validatePoint(p, `points[${i}]`));
        const provider = options.provider || "auto";
        const profile = (options.profile || "driving").toString();
        const roundtrip = options.roundtrip !== undefined ? Boolean(options.roundtrip) : false;

        // Google Directions with optimize:true (note: Google keeps origin/destination fixed if included; optimize true only reorders waypoints)
        if ((provider === "google" || provider === "auto") && options.googleApiKey) {
            // For Google, treat first point as origin and last as destination if more than 2,
            // otherwise it's origin->destination only.
            const origin = _toGoogleLatLng(pts[0]);
            const destination = pts.length > 2 ? _toGoogleLatLng(pts[pts.length - 1]) : _toGoogleLatLng(pts[1]);
            const waypoints = pts.length > 2 ? pts.slice(1, pts.length - 1).map(_toGoogleLatLng).join("|") : "";
            const waypointParam = waypoints ? `&waypoints=optimize:true|${encodeURIComponent(waypoints)}` : "";
            const url = `${GOOGLE_DIRECTIONS_URL}?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}${waypointParam}&key=${encodeURIComponent(options.googleApiKey)}`;
            const data = await _fetchJson(url);
            if (data.status !== "OK") throw new Error(`Google Directions error: ${data.status}`);
            const route = data.routes && data.routes[0];
            const waypointOrder = route && route.waypoint_order ? route.waypoint_order : [];
            // Build reordered list: origin + waypoints in order + destination (when applicable)
            const reordered = [];
            reordered.push(pts[0]);
            if (pts.length > 2) {
                for (const idx of waypointOrder) {
                    reordered.push(pts[1 + idx]);
                }
                reordered.push(pts[pts.length - 1]);
            } else {
                // only two points
                reordered.push(pts[1]);
            }
            const distance = route.legs ? route.legs.reduce((s, l) => s + (l.distance ? l.distance.value : 0), 0) : null;
            const duration = route.legs ? route.legs.reduce((s, l) => s + (l.duration ? l.duration.value : 0), 0) : null;
            return { waypoints: reordered, waypointsOrder: waypointOrder, distance, duration, provider: "google" };
        }

        // OSRM trip service: optimizes route for a roundtrip by default; can pin source/destination via options.source/destination
        if (provider === "osrm" || provider === "auto") {
            // OSRM expects lon,lat list separated by ;
            const coords = pts.map(_toOsrmCoord).join(";");
            // Use source/target if provided (index of start/end) otherwise default roundtrip/off
            // If user wants non-roundtrip, set roundtrip=false and set source=0&destination=last
            const params = [];
            if (roundtrip === false) {
                params.push("roundtrip=false");
                params.push("source=first");
                params.push("destination=last");
            }
            params.push("overview=full");
            const url = `${OSRM_BASE}/trip/v1/${profile}/${coords}?${params.join("&")}`;
            const data = await _fetchJson(url);
            if (data.code && data.code !== "Ok") throw new Error(`OSRM trip error: ${data.code}`);
            const trip = data.trips && data.trips[0];
            // data.waypoints contains mapping: waypoint.index is index in coordinates, waypoint.waypoint_index
            const order = (trip && trip.geometry && data.waypoints) ? data.waypoints.map(w => w.waypoint_index) : null;
            // Construct reordered points using data.waypoints order
            let waypointOrder = [];
            if (data.waypoints && data.waypoints.length) {
                // OSRM's waypoints have .waypoint_index == position in routes (0..n-1)
                const sorted = data.waypoints.slice().sort((a, b) => a.waypoint_index - b.waypoint_index);
                waypointOrder = sorted.map(wp => wp.location); // actually location is [lon,lat] but we return indices as position order
            }
            const orderedPts = (trip && trip.legs) ? (() => {
                // data.waypoints has 'hint' and 'name' but not directly index mapping; easier: trip.waypoint_indices may exist
                // We'll derive via trip.geometry: but for simplicity return trip.waypoints order using data.waypoints[*].hint mapping
                // Instead return pts reordered by data.waypoints sorted by waypoint_index property
                if (data.waypoints && data.waypoints.length === pts.length) {
                    const sorted = data.waypoints.slice().sort((a, b) => a.waypoint_index - b.waypoint_index);
                    return sorted.map(w => {
                        const [lon, lat] = w.location;
                        return { lat: Number(lat), lng: Number(lon) };
                    });
                }
                return pts;
            })() : pts;
            const dist = trip ? trip.distance : null;
            const dur = trip ? trip.duration : null;
            return { waypoints: orderedPts, waypointsOrder: null, distance: dist, duration: dur, provider: "osrm" };
        }

        // ORS route optimization / directions: ORS optimization endpoint exists (optimization) but may require paid tiers.
        // Fallback: simple nearest-neighbor reorder using haversine to produce a naive optimized order (not globally optimal)
        // Implementation: start at first point, greedily pick nearest unvisited.
        const naiveOrder = [0];
        const n = pts.length;
        const visited = new Array(n).fill(false);
        visited[0] = true;
        for (let k = 1; k < n; k++) {
            const last = pts[naiveOrder[naiveOrder.length - 1]];
            let best = -1;
            let bestD = Infinity;
            for (let j = 0; j < n; j++) {
                if (!visited[j]) {
                    const d = _haversine(last, pts[j]);
                    if (d < bestD) {
                        bestD = d;
                        best = j;
                    }
                }
            }
            if (best === -1) break;
            visited[best] = true;
            naiveOrder.push(best);
        }
        const ordered = naiveOrder.map(i => pts[i]);
        return { waypoints: ordered, waypointsOrder: naiveOrder, distance: null, duration: null, provider: "naive-haversine" };
    } catch (error) {
        console.error("Error in optimizeRoute:", error);
        throw error;
    }
}

/**
 * Get estimated travel time between two points (seconds).
 * Wrapper around calculateDistance that returns duration if available or null.
 */
async function getEstimatedTime(a, b, options = {}) {
    try {
        const res = await calculateDistance(a, b, options);
        return res.duration ?? null;
    } catch (error) {
        console.error("Error in getEstimatedTime:", error);
        throw error;
    }
}

// Export for Node.js
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        calculateDistance,
        getDistanceMatrix,
        optimizeRoute,
        getEstimatedTime,
        _haversine, // exported for convenience/testing
    };
}

// Expose for browser usage
if (typeof window !== "undefined") {
    window.DistanceRouteAPI = {
        calculateDistance,
        getDistanceMatrix,
        optimizeRoute,
        getEstimatedTime,
        _haversine,
    };
}
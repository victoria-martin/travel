/*
  OSRM's public demo server needs no key but takes waypoints as lon,lat. A scenario's route only
  changes when one of its steps moves, so results are cached per waypoint list. The route is asked
  for twice per render — the map draws the line, the step list reads the legs — so the cache holds
  the promise and both share one request.
*/

const OSRM_URL = 'https://router.project-osrm.org/route/v1/driving';
const ROUTE_HELP =
  "Choisir un scénario trace son trajet et n'affiche que les hébergements qu'il utilise.";

const routeCache = new Map();

function routeKey(points) {
  return points.map(([lat, lng]) => `${lat.toFixed(5)},${lng.toFixed(5)}`).join(';');
}

// { line: [[lat, lng]…], legs: [{ distance (m), duration (s) }…] }, one leg per pair of waypoints.
function fetchRoute(points) {
  const key = routeKey(points);
  if (!routeCache.has(key)) {
    routeCache.set(
      key,
      requestRoute(points).catch((e) => {
        routeCache.delete(key);
        throw e;
      }),
    );
  }
  return routeCache.get(key);
}

async function requestRoute(points) {
  const waypoints = points.map(([lat, lng]) => `${lng},${lat}`).join(';');
  const res = await fetch(`${OSRM_URL}/${waypoints}?overview=simplified&geometries=geojson`);
  if (!res.ok) throw new Error(`OSRM a répondu ${res.status}`);
  const data = await res.json();
  if (data.code !== 'Ok' || !data.routes || !data.routes.length) {
    throw new Error(`OSRM: ${data.code || 'aucun itinéraire'}`);
  }

  const route = data.routes[0];
  return {
    line: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    legs: (route.legs || []).map(({ distance, duration }) => ({ distance, duration })),
  };
}

function setRouteNotice(id, message) {
  const notice = document.getElementById(id);
  if (notice) notice.textContent = message;
}

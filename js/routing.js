/*
  OSRM's public demo server needs no key but takes waypoints as lon,lat. A scenario's route only
  changes when one of its steps moves, so results are cached per waypoint list.
*/

const OSRM_URL = 'https://router.project-osrm.org/route/v1/driving';
const ROUTE_HELP =
  "Choisir un scénario trace son trajet et n'affiche que les hébergements qu'il utilise.";

const routeCache = new Map();

function routeKey(points) {
  return points.map(([lat, lng]) => `${lat.toFixed(5)},${lng.toFixed(5)}`).join(';');
}

async function fetchRoute(points) {
  const key = routeKey(points);
  if (routeCache.has(key)) return routeCache.get(key);

  const waypoints = points.map(([lat, lng]) => `${lng},${lat}`).join(';');
  const res = await fetch(`${OSRM_URL}/${waypoints}?overview=simplified&geometries=geojson`);
  if (!res.ok) throw new Error(`OSRM a répondu ${res.status}`);
  const data = await res.json();
  if (data.code !== 'Ok' || !data.routes || !data.routes.length) {
    throw new Error(`OSRM: ${data.code || 'aucun itinéraire'}`);
  }

  const route = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
  routeCache.set(key, route);
  return route;
}

function setRouteNotice(message) {
  const notice = document.getElementById('route-notice');
  if (notice) notice.textContent = message;
}

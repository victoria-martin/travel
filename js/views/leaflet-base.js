const MAP_DEFAULT_CENTER = [44.3, 9.5];
const MAP_DEFAULT_ZOOM = 7;

function createLeafletMap(elementId) {
  const map = L.map(elementId).setView(MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map);
  return map;
}

function fitToPoints(map, points) {
  if (points.length > 1) map.fitBounds(points, { padding: [40, 40] });
  else if (points.length === 1) map.setView(points[0], 11);
}

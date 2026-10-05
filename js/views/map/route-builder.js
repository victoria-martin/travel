/*
  Un itinéraire libre entre des points de la carte, temporaire comme un mode de vue : rien n'est
  enregistré, seul le geste en cours vit dans une globale du module. Actif, cliquer un marqueur
  ajoute son point à la liste au lieu d'épingler son popup ; la liste se glisse pour se réordonner,
  sur le patron de step-drag.js. Le tracé redemande OSRM à chaque changement, via routing.js.
*/
var routeBuilder = { active: false, points: [] };
let draggedRoutePoint = -1;

function toggleRouteBuilderMode() {
  routeBuilder.active = !routeBuilder.active;
  if (!routeBuilder.active) routeBuilder.points = [];
  refreshMap();
}

function addRouteBuilderPoint(lat, lng, name, id, kind) {
  routeBuilder.points.push({ lat, lng, name, id, kind });
  refreshMap();
}

function removeRouteBuilderPoint(index) {
  routeBuilder.points.splice(index, 1);
  refreshMap();
}

function clearRouteBuilderPoints() {
  routeBuilder.points = [];
  refreshMap();
}

function startRoutePointDrag(event, index) {
  draggedRoutePoint = index;
  event.dataTransfer.effectAllowed = 'move';
}

function overRoutePointRow(event) {
  if (draggedRoutePoint < 0) return;
  event.preventDefault();
  markDrop(
    event.currentTarget,
    event.clientY,
    'route-builder-drop-before',
    'route-builder-drop-after',
  );
}

function dropOnRoutePointRow(event, index) {
  if (draggedRoutePoint < 0) return;
  event.preventDefault();
  const [from, before] = [draggedRoutePoint, overTopHalf(event.currentTarget, event.clientY)];
  endRoutePointDrag();
  if (from === index) return;
  const [point] = routeBuilder.points.splice(from, 1);
  const at = index - (from < index ? 1 : 0);
  routeBuilder.points.splice(before ? at : at + 1, 0, point);
  refreshMap();
}

function endRoutePointDrag() {
  draggedRoutePoint = -1;
  markDrop(null, 0, 'route-builder-drop-before', 'route-builder-drop-after');
}

async function drawRouteBuilderLine(map) {
  if (routeBuilder.points.length < 2) return;
  const points = routeBuilder.points.map((p) => [p.lat, p.lng]);
  try {
    const { line } = await fetchRoute(points);
    if (!map.getContainer().isConnected) return;
    L.polyline(line, { color: '#B5533C', weight: 4, opacity: 0.9, dashArray: '6 6' }).addTo(map);
    drawRouteArrows(map, line);
  } catch (e) {
    console.warn('Itinéraire indisponible', e);
  }
}

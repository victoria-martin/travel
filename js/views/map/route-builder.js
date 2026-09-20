/*
  Un itinéraire libre entre des points de la carte, temporaire comme un mode de vue : rien n'est
  enregistré, seul le geste en cours vit dans une globale du module. Actif, cliquer un marqueur
  ajoute son point à la liste au lieu d'épingler son popup ; la liste se glisse pour se réordonner,
  sur le patron de step-drag.js. Le tracé redemande OSRM à chaque changement, via routing.js.
*/
let routeBuilder = { active: false, points: [] };
let draggedRoutePoint = -1;

function toggleRouteBuilderMode() {
  routeBuilder.active = !routeBuilder.active;
  if (!routeBuilder.active) routeBuilder.points = [];
  refreshMap();
}

function addRouteBuilderPoint(lat, lng, name) {
  routeBuilder.points.push({ lat, lng, name });
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
  markDrop(event.currentTarget, event.clientY, 'route-builder-drop-before', 'route-builder-drop-after');
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

function routeBuilderPanel() {
  if (!routeBuilder.active) return '';
  return /* HTML */ `<div class="map-side-panel">
    <div class="map-side-title">Itinéraire</div>
    ${routeBuilder.points.length
      ? routeBuilder.points.map(routeBuilderRow).join('')
      : '<div class="route-builder-hint">Clique des points sur la carte.</div>'}
    ${routeBuilder.points.length > 1
      ? '<div class="route-builder-summary" id="route-builder-summary"></div>'
      : ''}
    ${routeBuilder.points.length
      ? `<button class="link-btn" onclick="clearRouteBuilderPoints()">Effacer</button>`
      : ''}
  </div>`;
}

function routeBuilderRow(point, index) {
  return /* HTML */ `<div
    class="route-builder-row"
    draggable="true"
    ondragstart="startRoutePointDrag(event, ${index})"
    ondragover="overRoutePointRow(event)"
    ondrop="dropOnRoutePointRow(event, ${index})"
    ondragend="endRoutePointDrag()"
  >
    <span class="route-builder-handle" title="Glisser pour réordonner">⠿</span>
    <span class="route-builder-index">${index + 1}.</span>
    <span class="route-builder-name">${escapeHtml(point.name)}</span>
    <button class="icon-btn" onclick="removeRouteBuilderPoint(${index})" title="Retirer">
      ${svgIcon('x')}
    </button>
  </div>`;
}

// Le fetch OSRM peut revenir après un re-render : la carte détachée du DOM ne se dessine plus.
async function drawRouteBuilderLine(map) {
  if (routeBuilder.points.length < 2) return;
  const points = routeBuilder.points.map((p) => [p.lat, p.lng]);
  try {
    const { line, legs } = await fetchRoute(points);
    if (!map.getContainer().isConnected) return;
    L.polyline(line, { color: '#B5533C', weight: 4, opacity: 0.9, dashArray: '6 6' }).addTo(map);
    drawRouteArrows(map, line);
    const summary = document.getElementById('route-builder-summary');
    if (!summary) return;
    const distance = legs.reduce((sum, leg) => sum + leg.distance, 0);
    const duration = legs.reduce((sum, leg) => sum + leg.duration, 0);
    summary.textContent = `${(distance / 1000).toFixed(1)} km · ${Math.round(duration / 60)} min`;
  } catch (e) {
    console.warn('Itinéraire indisponible', e);
  }
}

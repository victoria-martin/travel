/*
  Le tracé d'un scénario s'affiche à deux endroits — la vue Carte et le détail du scénario —
  chacun avec sa propre instance Leaflet et son propre emplacement de message.
*/

const ROUTE_ARROW_COUNT = 12;

function drawScenarioOnMap(map, scenario, noticeId, idleMessage) {
  const points = scenario.steps.map((st) => coordsFor(st)).filter(Boolean);
  stepsByCoords(scenario.steps).forEach(({ coords, stops }) => {
    L.marker(coords, { icon: stepPin(stops.map((s) => stepLetter(s.idx))) })
      .bindPopup(stepPinPopup(stops))
      .addTo(map);
  });
  if (points.length > 1) drawScenarioRoute(map, points, noticeId, idleMessage);
  return points;
}

// Un aller-retour repasse par la même ville : ses étapes partagent une pastille, « A·G ».
function stepsByCoords(steps) {
  const groups = new Map();
  steps.forEach((step, idx) => {
    const coords = coordsFor(step);
    if (!coords) return;
    const key = `${coords[0]},${coords[1]}`;
    if (!groups.has(key)) groups.set(key, { coords, stops: [] });
    groups.get(key).stops.push({ step, idx });
  });
  return Array.from(groups.values());
}

function stepPin(letters) {
  return L.divIcon({
    className: 'step-pin',
    html: letters.join('·'),
    iconSize: [24 + (letters.length - 1) * 13, 24],
  });
}

function stepPinPopup(stops) {
  return stops
    .map(
      ({ step, idx }) =>
        `<strong>${stepLetter(idx)} · ${escapeHtml(step.city)}</strong>${step.nights ? `<br/>${nightsLabel(step.nights)}` : ''}`,
    )
    .join('<div class="step-pin-sep"></div>');
}

// Le fetch OSRM peut revenir après un re-render : la carte détachée du DOM ne se dessine plus.
async function drawScenarioRoute(map, points, noticeId, idleMessage) {
  setRouteNotice(noticeId, '⏳ Calcul du trajet routier…');
  try {
    const route = await fetchRoute(points);
    if (!map.getContainer().isConnected) return;
    L.polyline(route, { color: '#3E6259', weight: 4, opacity: 0.9 }).addTo(map);
    drawRouteArrows(map, route);
    setRouteNotice(noticeId, idleMessage);
  } catch (e) {
    console.warn('Trajet routier indisponible', e);
    if (map.getContainer().isConnected) {
      setRouteNotice(noticeId, '⚠️ Trajet routier indisponible — réessaie plus tard.');
    }
  }
}

// Le sens de circulation se lit sur des chevrons régulièrement espacés le long du tracé.
function drawRouteArrows(map, route) {
  const travelled = [0];
  for (let i = 1; i < route.length; i++) {
    travelled.push(travelled[i - 1] + segmentLength(route[i - 1], route[i]));
  }
  const total = travelled[travelled.length - 1];
  if (!total) return;
  for (let n = 1; n <= ROUTE_ARROW_COUNT; n++) {
    const i = travelled.findIndex((d) => d >= (total * n) / (ROUTE_ARROW_COUNT + 1));
    if (i < 1) continue;
    L.marker(route[i], {
      pane: routeArrowPane(map),
      interactive: false,
      icon: L.divIcon({
        className: 'route-arrow',
        html: `<span style="transform:rotate(${screenBearing(route[i - 1], route[i])}deg)">➤</span>`,
        iconSize: [18, 18],
      }),
    }).addTo(map);
  }
}

// Sous les pastilles d'étape (markerPane, 600), au-dessus du tracé (overlayPane, 400).
function routeArrowPane(map) {
  if (!map.getPane('routeArrows')) map.createPane('routeArrows').style.zIndex = 550;
  return 'routeArrows';
}

function segmentLength(a, b) {
  return Math.hypot(...screenVector(a, b));
}

// ➤ pointe vers l'est, et rotate() tourne dans le sens horaire de l'écran.
function screenBearing(a, b) {
  const [dx, dy] = screenVector(a, b);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

function screenVector(a, b) {
  const meanLat = ((a[0] + b[0]) / 2) * (Math.PI / 180);
  return [(b[1] - a[1]) * Math.cos(meanLat), a[0] - b[0]];
}

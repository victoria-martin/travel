/*
  Le tracé d'un scénario s'affiche à deux endroits — la vue Carte et le détail du scénario —
  chacun avec sa propre instance Leaflet et son propre emplacement de message.
*/

const ROUTE_ARROW_COUNT = 12;

function drawScenarioOnMap(map, scenario, noticeId, idleMessage) {
  const steps = visibleSteps(scenario);
  const points = steps.map((st) => coordsFor(st)).filter(Boolean);
  stepsByCoords(steps).forEach(({ coords, stops }) => {
    L.marker(coords, { icon: stepPin(stops.map((s) => stepLetter(s.idx))) })
      .bindPopup(stepPinPopup(scenario, stops))
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

/*
  La pastille rend ce que l'étape sait déjà : ses dates, où l'on dort et pour combien, où en est la
  réservation. Les deux gestes qu'on veut faire depuis la carte y sont aussi — ouvrir le site de
  l'hébergement, ouvrir sa fiche — plutôt que de retourner au détail du scénario pour les trouver.
*/
function stepPinPopup(scenario, stops) {
  return stops
    .map(({ step, idx }) => stepPinStop(scenario, step, idx))
    .join('<div class="step-pin-sep"></div>');
}

function stepPinStop(scenario, step, idx) {
  const nights = stepNights(step);
  const status = stepStatusInfo(stepStatus(scenario, step));
  const lines = [
    [stepDateRange(scenario, idx), nights ? nightsLabel(nights) : ''].filter(Boolean).join(' · '),
    `${status.emoji} ${status.label}`,
    stepPinAccommodation(step),
    step.notes ? escapeHtml(step.notes) : '',
  ].filter(Boolean);
  return `<div class="step-pin-popup">
      <strong>${stepLetter(idx)} · ${escapeHtml(step.name)}</strong>
      ${lines.map((line) => `<div>${line}</div>`).join('')}
      ${stepPinLinks(step)}
    </div>`;
}

// Le prix est celui que le détail affiche : la nuitée de l'hébergement fois les nuits de l'étape.
function stepPinAccommodation(step) {
  const acc = getAccommodation(step.accommodationId);
  if (!acc) return '';
  const cost = stepAccommodationCost(step);
  return [
    `${accType(acc.type).emoji} ${escapeHtml(acc.name)}`,
    cost ? formatAccommodationCost(acc, cost) : '',
  ]
    .filter(Boolean)
    .join(' · ');
}

// La fiche s'ouvre en panneau par-dessus la carte, d'où un libellé et non le ↗ des tableaux.
function stepPinLinks(step) {
  const acc = getAccommodation(step.accommodationId);
  if (!acc) return '';
  const links = [
    acc.link ? externalLink(acc.link, 'Site') : '',
    acc.bookingLink ? externalLink(acc.bookingLink, 'Booking') : '',
    `<button class="link-btn" onclick="openAccommodationSheet('${acc.id}')">Fiche</button>`,
  ].filter(Boolean);
  return `<div class="step-pin-links">${links.join('')}</div>`;
}

// Le fetch OSRM peut revenir après un re-render : la carte détachée du DOM ne se dessine plus.
async function drawScenarioRoute(map, points, noticeId, idleMessage) {
  setRouteNotice(noticeId, '⏳ Calcul du trajet routier…');
  try {
    const { line } = await fetchRoute(points);
    if (!map.getContainer().isConnected) return;
    L.polyline(line, { color: '#3E6259', weight: 4, opacity: 0.9 }).addTo(map);
    drawRouteArrows(map, line);
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

/*
  Le tracé d'un scénario s'affiche à deux endroits — la vue Carte et le détail du scénario —
  chacun avec sa propre instance Leaflet et son propre emplacement de message.
*/

const STEP_MARKER = {
  radius: 7,
  color: '#24312B',
  weight: 1,
  fillColor: '#C98A3E',
  fillOpacity: 0.95,
};

function drawScenarioOnMap(map, scenario, noticeId, idleMessage) {
  const points = [];
  scenario.steps.forEach((st, idx) => {
    const c = coordsFor(st);
    if (!c) return;
    points.push(c);
    L.circleMarker(c, STEP_MARKER)
      .bindPopup(
        `<strong>${escapeHtml(st.city)}</strong><br/>Étape ${idx + 1}${st.nights ? ` · ${nightsLabel(st.nights)}` : ''}`,
      )
      .addTo(map);
  });
  if (points.length > 1) drawScenarioRoute(map, points, noticeId, idleMessage);
  return points;
}

// Le fetch OSRM peut revenir après un re-render : la carte détachée du DOM ne se dessine plus.
async function drawScenarioRoute(map, points, noticeId, idleMessage) {
  setRouteNotice(noticeId, '⏳ Calcul du trajet routier…');
  try {
    const route = await fetchRoute(points);
    if (!map.getContainer().isConnected) return;
    L.polyline(route, { color: '#3E6259', weight: 4, opacity: 0.9 }).addTo(map);
    setRouteNotice(noticeId, idleMessage);
  } catch (e) {
    console.warn('Trajet routier indisponible', e);
    if (map.getContainer().isConnected) {
      setRouteNotice(noticeId, '⚠️ Trajet routier indisponible — réessaie plus tard.');
    }
  }
}

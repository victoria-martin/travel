/*
  La signature d'un scénario : un segment par lieu, dans l'ordre du trajet, large comme ses nuits et
  teinté de l'avancement de son séjour. L'échelle est celle de la liste entière — le plus long
  scénario tient toute la largeur, les autres se mesurent contre lui — sans quoi deux voyages de
  durées différentes se ressembleraient.
*/
function scenarioRouteBar(s, maxNights) {
  const places = nightsByPlace(s);
  if (places.length === 0) return '<div class="scenario-route-empty">Aucune étape</div>';
  const nights = totalNights(s);
  return /* HTML */ `<div class="scenario-route" style="width:${(nights / maxNights) * 100}%">
    ${routeDates(s)}
    <div class="scenario-route-bar">${places.map((p) => routeSegment(s, p)).join('')}</div>
    <div class="scenario-route-legend">${places.map((p) => routeLabel(p, nights)).join('')}</div>
  </div>`;
}

// Le départ et le retour tiennent les deux bouts de la bande : le retour tombe là où le voyage
// s'arrête, donc plus tôt que celui d'un scénario plus long.
function routeDates(s) {
  const start = stepArrival(s, 0);
  if (!start) return '';
  const nights = totalNights(s);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + nights);
  return /* HTML */ `<div class="scenario-route-dates">
    <span>${escapeHtml(formatStepDay(start))}</span>
    ${nights ? `<span>${escapeHtml(formatStepDay(end))}</span>` : ''}
  </div>`;
}

function routeSegment(scenario, p) {
  const key = placeStatus(scenario, p);
  const status = stepStatusInfo(key);
  const title = `${routePlaceName(p)} · ${nightsLabel(p.nights)} · ${status.emoji} ${status.label}`;
  return /* HTML */ `<span
    class="scenario-route-seg"
    style="flex:${p.nights}; background:${stepStatusBackground(key)};"
    title="${escapeHtml(title)}"
  ></span>`;
}

// Un segment trop étroit ne porte pas son nom : les étiquettes se chevaucheraient dès une nuit.
const MIN_LABELLED_SHARE = 0.08;

function routeLabel(p, nights) {
  const label = p.nights / nights >= MIN_LABELLED_SHARE ? escapeHtml(routePlaceName(p)) : '';
  return /* HTML */ `<span class="scenario-route-name" style="flex:${p.nights};">${label}</span>`;
}

// Le lieu d'un séjour porte son nom ; un hébergement se dit par sa ville, ou par son nom.
function routePlaceName(p) {
  if (p.place) return p.place.name;
  return p.acc ? p.acc.city || p.acc.name : 'Sans lieu';
}

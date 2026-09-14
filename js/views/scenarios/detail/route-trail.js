/*
  Le fil du trajet : un maillon par étape retenue, dans l'ordre, chacun large comme ses nuits et
  teinté du type de son hébergement — la même lecture que la bande de la liste, en cliquable. Il
  sert à se repérer dans une longue liste de cartes, donc un maillon mène à sa carte.
*/
function scenarioRouteTrail(scenario) {
  const steps = visibleSteps(scenario);
  if (steps.length < 2) return '';
  return /* HTML */ `<div class="route-trail">
    ${steps.map((step, rank) => routeTrailLink(scenario, step, rank)).join('')}
  </div>`;
}

// Une étape sans nuit est une traversée : elle garde un maillon étroit plutôt que rien du tout.
function routeTrailLink(scenario, step, rank) {
  const nights = stepNights(step);
  const acc = getAccommodation(step.accommodationId);
  const meta = [nightsLabel(nights), stepArrivalDay(scenario, rank)].filter(Boolean);
  return /* HTML */ `<button
    class="route-trail-link"
    style="flex:${nights + 1}"
    onclick="scrollToStepCard('${step.id}')"
    title="${escapeHtml(routeTrailName(step))}"
  >
    <span class="route-trail-bar" style="background:${accType(acc && acc.type).color}"></span>
    <span class="route-trail-head">
      <span class="route-trail-letter">${stepLetter(rank)}</span>
      <span class="route-trail-name">${escapeHtml(routeTrailName(step))}</span>
    </span>
    <span class="route-trail-meta">${meta.join(' · ')}</span>
  </button>`;
}

// Le nom de l'étape prime : c'est celui qu'on a écrit. Le lieu prend le relais quand il manque.
function routeTrailName(step) {
  const place = stepPlace(step);
  return step.name || (place && place.name) || 'Sans lieu';
}

function scrollToStepCard(stepId) {
  const card = document.getElementById(`step-card-${stepId}`);
  if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

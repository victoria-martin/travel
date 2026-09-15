/*
  Seconde lecture du fil du trajet, posée sous la première : un maillon par étape, mais large — le
  nom tient en entier, et chaque maillon dit ce que l'étape dure et la route qui y mène. D'où le
  minimum de largeur et le défilement horizontal plutôt qu'un partage de la place, qui rendait les
  titres illisibles dès la sixième étape.
*/
function scenarioRouteStrip(scenario) {
  const steps = visibleSteps(scenario);
  if (steps.length < 2) return '';
  return /* HTML */ `<div class="route-strip">
    ${steps.map((step, rank) => routeStripLink(scenario, step, rank)).join('')}
  </div>`;
}

function routeStripLink(scenario, step, rank) {
  return /* HTML */ `<button
    class="route-strip-link"
    onclick="scrollToStepCard('${step.id}')"
    title="${escapeHtml(routeTrailName(step))}"
  >
    <span class="route-strip-bar" style="background:${routeTrailColor(scenario, step)}"></span>
    <span class="route-strip-row">
      <span class="route-strip-head">
        <span class="route-trail-letter">${stepLetter(rank)}</span>
        <span class="route-strip-name">${escapeHtml(routeTrailName(step))}</span>
      </span>
      <span class="route-strip-nights">${nightsLabel(stepNights(step))}</span>
    </span>
    <span class="route-strip-row route-strip-meta">
      <span>${stayRangeLabel(stepArrival(scenario, rank), stepNights(step))}</span>
      ${stepLegRoadSlot(scenario, step)}
    </span>
  </button>`;
}

// Les bandes d'itinéraire partagent une échelle : le plus long scénario donne la largeur pleine.
function scenarioList(scenarios) {
  const maxNights = Math.max(1, ...scenarios.map(totalNights));
  return /* HTML */ `<div class="scenario-list">
    ${scenarios.map((s) => scenarioRow(s, maxNights)).join('')}
  </div>`;
}

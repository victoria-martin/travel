// Les scénarios cochés se posent côte à côte dans la largeur, dans l'ordre de la liste.
function scenarioCompare(items) {
  const chosen = comparedScenarios(items);
  if (chosen.length === 0)
    return '<p class="filter-hint">Coche des scénarios pour les comparer.</p>';
  return /* HTML */ `<div class="scenario-compare">
    ${chosen.map(scenarioCompareCard).join('')}
  </div>`;
}

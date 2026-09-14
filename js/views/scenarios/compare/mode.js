/*
  Comparer est un mode de la liste, pas une vue : les lignes restent, elles gagnent une case. La
  sélection est transitoire — elle ne vit que le temps de la session, comme le scénario ouvert.
*/
let compareMode = false;
let comparedScenarioIds = [];

function toggleCompareMode() {
  compareMode = !compareMode;
  render();
}

function isComparedScenario(id) {
  return comparedScenarioIds.includes(id);
}

function toggleComparedScenario(id) {
  comparedScenarioIds = isComparedScenario(id)
    ? comparedScenarioIds.filter((x) => x !== id)
    : comparedScenarioIds.concat(id);
  render();
}

function comparedScenarios(items) {
  return items.filter((s) => isComparedScenario(s.id));
}

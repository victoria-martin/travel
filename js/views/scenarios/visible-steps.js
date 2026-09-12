/*
  Une étape masquée est une variante mise de côté : elle ne compte ni dans les dates, ni dans les
  nuits, ni dans les totaux, ni sur la carte. Seule la liste du détail la montre, grisée.
  Partout ailleurs un `idx` d'étape est un rang dans les étapes visibles, pas dans `scenario.steps`.
*/
function visibleSteps(scenario) {
  return scenario.steps.filter((st) => !st.hidden);
}

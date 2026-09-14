/*
  Une étape masquée est une variante mise de côté, et l'étape d'une colonne non retenue en est une
  autre : ni l'une ni l'autre ne comptent dans les dates, les nuits, les totaux ou la carte. Seule
  la liste du détail les montre, grisées. Partout ailleurs un `idx` d'étape est un rang dans les
  étapes visibles, pas dans `scenario.steps`.
*/
function visibleSteps(scenario) {
  return scenario.steps.filter((st) => !st.hidden && isStepRetained(scenario, st));
}

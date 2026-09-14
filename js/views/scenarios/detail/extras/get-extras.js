/*
  Les lignes — activités et dépenses. Elles vivent sur leur porteur, qui est une étape ou un
  groupe : celles d'un groupe valent quelle que soit la colonne retenue, celles d'une étape ne
  valent que si la sienne l'est. Une ligne s'adresse par son identifiant et jamais par son rang,
  puisque chaque porteur n'affiche que les siennes.
*/
function holderExtras(holder) {
  if (!Array.isArray(holder.extras)) holder.extras = [];
  return holder.extras;
}

function getExtraHolder(scenarioId, holderId) {
  const scenario = getScenario(scenarioId);
  return (
    scenario.steps.find((st) => st.id === holderId) ||
    scenarioGroups(scenario).find((g) => g.id === holderId) ||
    null
  );
}

function findHolderExtra(scenarioId, holderId, lineId) {
  return holderExtras(getExtraHolder(scenarioId, holderId)).find((line) => line.id === lineId);
}

// Une ligne référence une activité ou une dépense, jamais les deux.
function extraAttraction(line) {
  return line.attractionId ? getAttraction(line.attractionId) : null;
}

function extraCost(line) {
  return line.costId ? getFixedCost(line.costId) : null;
}

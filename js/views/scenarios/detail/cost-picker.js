/*
  La recherche d'une dépense, jumelle de celle des attractions : les dépenses du voyage courant
  hors celles déjà rattachées, et la création du nom tapé quand il n'y en a aucune.
*/

function costMatches(query, usedIds) {
  const needle = query.toLowerCase();
  return ofCurrentTravel(state.fixedCosts)
    .filter((cost) => !usedIds.includes(cost.id) && costLabel(cost).toLowerCase().includes(needle))
    .sort((a, b) => costLabel(a).localeCompare(costLabel(b)));
}

function costLabel(cost) {
  return cost.label || 'Sans libellé';
}

// Une dépense créée ici ne porte que son libellé : le montant se complète depuis la page Dépenses.
function createFixedCostNamed(label) {
  const item = { ...emptyFixedCost(), id: uid(), travelId: currentTravelId(), label };
  state.fixedCosts.push(item);
  saveNow();
  return item;
}

/*
  Le catalogue est personnel : pas de travelId, il ne se filtre pas par voyage. C'est la base
  de `packingListItems`, la valise de chaque voyage, qui y référence ses lignes.
*/
function getPackingItem(id) {
  return state.packingItems.find((i) => i.id === id);
}

function sortedPackingItems() {
  return [...state.packingItems].sort((a, b) => (a.label || '').localeCompare(b.label || '', 'fr'));
}

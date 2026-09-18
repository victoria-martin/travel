/*
  Un item de valise référence une entrée du catalogue, ou porte son libellé et ses catégories en
  propre s'il est né dans ce voyage (maillot de bain). Un fait qui vivrait aux deux endroits se
  dérive plutôt qu'il ne se synchronise : le libellé et les catégories se lisent donc ici, jamais
  recopiés sur l'item de valise tant qu'il référence le catalogue.
*/
function packingLineSource(item) {
  return item.packingItemId ? getPackingItem(item.packingItemId) : null;
}

function packingLineLabel(item) {
  const source = packingLineSource(item);
  return (source ? source.label : item.label) || 'Sans nom';
}

function packingLineCategories(item) {
  const source = packingLineSource(item);
  return (source ? source.categories : item.categories) || [];
}

const MAX_PACKING_QUANTITY = 20;

// Décidé : la quantité vaut soit un nombre fixe, soit une par nuit du scénario retenu.
function packingItemQuantity(item) {
  if (!item.perNight) return parseInt(item.quantity) || 0;
  const scenario = chosenScenario();
  return scenario ? totalNights(scenario) : 0;
}

function packingQuantityLabel(item) {
  const n = packingItemQuantity(item);
  return item.perNight ? `${n} · 1/nuit` : `${n}`;
}

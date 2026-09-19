/*
  Trois écrans groupent des items de valise par catégorie : le catalogue, le panneau de
  composition, l'onglet du scénario. Le repli d'un groupe est un geste transitoire, pas une
  préférence à retrouver — il vit dans une globale, comme `editingTagsId`, et se perd au rechargement.
*/
let packingClosedGroups = new Set();

function isPackingGroupOpen(category) {
  return !packingClosedGroups.has(category);
}

// Lit l'état déjà posé sur l'élément plutôt que de l'inverser : `ontoggle` peut se déclencher à
// la seule insertion d'un `<details open>` reconstruit par un rendu, pas seulement au clic — un
// simple inverseur finirait fermé après quelques rendus sans qu'on ait rien cliqué.
function setPackingGroupOpen(category, isOpen) {
  if (isOpen) packingClosedGroups.delete(category);
  else packingClosedGroups.add(category);
}

// items = tableau d'entités qui portent déjà leur catégorie résolue (getCategory(item)).
function groupPackingByCategory(items, getCategory) {
  const groups = new Map();
  items.forEach((item) => {
    const category = getCategory(item) || UNCATEGORIZED;
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category).push(item);
  });
  return Array.from(groups.entries())
    .sort(([a], [b]) => {
      if (a === UNCATEGORIZED) return 1;
      if (b === UNCATEGORIZED) return -1;
      return a.localeCompare(b, 'fr');
    })
    .map(([category, groupItems]) => ({ category, items: groupItems }));
}

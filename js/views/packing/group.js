/*
  Trois écrans groupent des items de valise par catégorie : le catalogue, le panneau de
  composition, l'onglet du scénario. Le repli d'un groupe est un geste transitoire, pas une
  préférence à retrouver — il vit dans une globale, comme `openInlineMenu`, et se perd au rechargement.
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

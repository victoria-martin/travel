/*
  Les catégories sont du texte libre, comme celles des charges fixes : l'union de ce qui est déjà
  posé sur le catalogue et sur les items propres à un voyage, catalogue et valises confondus.
*/
function allPackingCategories() {
  const set = new Set();
  state.packingItems.forEach((i) => (i.categories || []).forEach((c) => set.add(c)));
  state.packingListItems.forEach((i) => (i.categories || []).forEach((c) => set.add(c)));
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'fr'));
}

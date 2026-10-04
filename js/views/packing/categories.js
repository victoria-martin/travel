/*
  Une catégorie par item, texte libre : la page Valise groupe le catalogue et la valise du voyage
  dessus, un item ne peut donc vivre que dans un seul groupe. La liste proposée en datalist est
  l'union de ce qui est déjà posé, catalogue et valises confondus.
*/
const UNCATEGORIZED = 'Sans catégorie';

function allPackingCategories() {
  const set = new Set();
  state.packingItems.forEach((i) => i.category && set.add(i.category));
  state.packingListItems.forEach((i) => i.category && set.add(i.category));
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'fr'));
}

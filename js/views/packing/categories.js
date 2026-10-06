function allPackingCategories() {
  const set = new Set();
  state.packingItems.forEach((i) => i.category && set.add(i.category));
  state.packingListItems.forEach((i) => i.category && set.add(i.category));
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'fr'));
}

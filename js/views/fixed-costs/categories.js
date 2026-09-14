/*
  Les catégories sont du texte libre porté par la charge : la liste des options est l'union de ce
  qui est déjà utilisé, une catégorie existe donc dès qu'elle est saisie quelque part.
*/
function allFixedCostCategories() {
  const set = new Set();
  ofCurrentTravel(state.fixedCosts).forEach((c) =>
    (c.categories || []).forEach((category) => set.add(category)),
  );
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'fr'));
}

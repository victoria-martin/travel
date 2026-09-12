/*
  Les tags sont du texte libre porté par l'hébergement : la liste des options est l'union de ce
  qui est déjà utilisé, un tag existe donc dès qu'il est saisi quelque part.
*/
function allAccommodationTags() {
  const set = new Set();
  ofCurrentTravel(state.accommodations).forEach((a) =>
    (a.tags || []).forEach((tag) => set.add(tag)),
  );
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'fr'));
}

function renderCitiesView() {
  const items = sortItems('villes', ofCurrentTravel(state.cities));
  return /* HTML */ `
    ${citiesHeader(items)}
    ${items.length === 0 ? emptyState('Aucune ville', 'Ajoute une première ville à visiter.') : listTable('villes', items)}
  `;
}

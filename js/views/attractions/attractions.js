function renderAttractionsView() {
  const items = sortItems('attractions', ofCurrentTravel(state.attractions));
  return /* HTML */ `
    ${attractionsHeader(items)}
    ${
      items.length === 0
        ? emptyState('Aucun lieu', 'Ajoute une ville, un village, un premier lieu à visiter.')
        : listTable('attractions', items)
    }
  `;
}

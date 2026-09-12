function renderAttractionsView() {
  const items = sortItems('attractions', ofCurrentTravel(state.attractions));
  return /* HTML */ `
    ${attractionsHeader(items)}
    ${
      items.length === 0
        ? emptyState('Aucune attraction', 'Ajoute un premier lieu à visiter.')
        : listTable('attractions', items)
    }
  `;
}

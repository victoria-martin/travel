function renderAttractionsView() {
  const source = ofCurrentTravel(state.attractions).map((item, index) => ({
    ...item,
    recentOrder: index,
  }));
  const items = sortItems('attractions', source);
  return /* HTML */ `
    ${attractionsHeader(items)}
    ${
      items.length === 0
        ? emptyState('Aucun lieu', 'Ajoute une ville, un village, un premier lieu à visiter.')
        : listTable('attractions', items)
    }
  `;
}

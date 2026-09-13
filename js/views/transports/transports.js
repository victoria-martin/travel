function renderTransportsView() {
  const items = sortItems('transports', ofCurrentTravel(state.transports));
  return /* HTML */ `
    ${transportsHeader(items)}
    ${
      items.length === 0
        ? emptyState('Aucun transport', 'Ajoute un premier trajet.')
        : listTable('transports', items)
    }
  `;
}

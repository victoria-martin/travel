function renderTransportsView() {
  return /* HTML */ `
    ${transportsHeader()}
    ${transportsTab === 'prestataires' ? renderProvidersTab() : renderTransportsList()}
  `;
}

function renderTransportsList() {
  const items = sortItems('transports', ofCurrentTravel(state.transports));
  if (!items.length) return emptyState('Aucun transport', 'Ajoute un premier trajet.');
  return listTable('transports', items);
}

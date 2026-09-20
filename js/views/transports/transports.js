function renderTransportsView() {
  return /* HTML */ ` ${transportsHeader()} ${currentTransportsTab().body()} `;
}

function renderTransportsList() {
  const items = sortItems(
    'transports',
    listSearchItems('transports', ofCurrentTravel(state.transports)),
  );
  if (!items.length) return emptyState('Aucun transport', 'Ajoute un premier trajet.');
  return listTable('transports', items);
}

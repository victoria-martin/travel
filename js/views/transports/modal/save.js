/*
  Le bloc compagnie / voiture dépend du mode : le champ de l'autre mode n'est pas dans le DOM,
  et sa valeur déjà enregistrée se garde plutôt que de s'effacer.
*/
function transportFieldValue(id, kept) {
  const field = document.getElementById(id);
  return field ? field.value.trim() : kept || '';
}

function readTransportForm(id) {
  const p = modal.payload;
  return {
    id: id || uid(),
    travelId: currentTravelId(),
    mode: transportFieldValue('t-mode'),
    status: transportFieldValue('t-status'),
    fromCityId: transportFieldValue('t-from-city'),
    fromPrecision: transportFieldValue('t-from-precision'),
    toCityId: transportFieldValue('t-to-city'),
    toPrecision: transportFieldValue('t-to-precision'),
    departDate: transportFieldValue('t-depart-date'),
    departTime: transportFieldValue('t-depart-time'),
    arriveDate: transportFieldValue('t-arrive-date'),
    arriveTime: transportFieldValue('t-arrive-time'),
    carrier: transportFieldValue('t-carrier', p.carrier),
    reference: transportFieldValue('t-reference', p.reference),
    carId: transportFieldValue('t-car', p.carId),
    budget: transportFieldValue('t-budget'),
    amountMin: transportFieldValue('t-amount-min'),
    amountMax: transportFieldValue('t-amount-max'),
    link: transportFieldValue('t-link'),
    notes: transportFieldValue('t-notes'),
    favorite: document.getElementById('t-favorite').checked,
  };
}

function upsertTransport(item) {
  const idx = state.transports.findIndex((t) => t.id === item.id);
  if (idx === -1) state.transports.push(item);
  else state.transports[idx] = item;
  saveNow();
}

function saveTransport(id) {
  upsertTransport(readTransportForm(id));
  closeModal();
}

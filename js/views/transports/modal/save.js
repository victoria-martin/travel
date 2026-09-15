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
    fromAttractionId: transportFieldValue('t-from-city'),
    fromPrecision: transportFieldValue('t-from-precision'),
    toAttractionId: transportFieldValue('t-to-city'),
    toPrecision: transportFieldValue('t-to-precision'),
    departDate: transportFieldValue('t-depart-date'),
    departTime: transportFieldValue('t-depart-time'),
    arriveDate: transportFieldValue('t-arrive-date'),
    arriveTime: transportFieldValue('t-arrive-time'),
    providerId: transportFieldValue('t-provider', p.providerId),
    reference: transportFieldValue('t-reference', p.reference),
    offerId: transportFieldValue('t-car', p.offerId),
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

// Ouverte depuis un scénario, la modale y rattache le trajet créé : on ne le rattache pas ensuite.
function saveTransport(id) {
  const { scenarioId } = modal;
  const transport = readTransportForm(id);
  upsertTransport(transport);
  const scenario = scenarioId ? getScenario(scenarioId) : null;
  if (scenario && !scenario.transportIds.includes(transport.id))
    scenario.transportIds.push(transport.id);
  saveNow();
  closeModal();
}

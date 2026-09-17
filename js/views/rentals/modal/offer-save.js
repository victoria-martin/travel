/*
  Le modèle choisi remplace le nom repris d'avant le catalogue : deux noms diraient la même chose.
  Le seul prix qui se saisit est celui du jour, tel que le loueur l'affiche.
*/
function saveOffer(id) {
  const existing = id ? getOffer(id) : null;
  const modelId = document.getElementById('offer-model').value;
  const offer = {
    ...emptyOffer(),
    id: id || uid(),
    travelId: currentTravelId(),
    isDefault: !!(existing && existing.isDefault),
    model: modelId ? '' : (existing || {}).model || '',
    providerId: document.getElementById('offer-provider').value,
    modelId,
    status: carStatusKey(document.getElementById('offer-status').value),
    location: document.getElementById('offer-location').value.trim(),
    pickupDate: document.getElementById('offer-pickup-date').value,
    pickupTime: document.getElementById('offer-pickup-time').value,
    dropoffDate: document.getElementById('offer-dropoff-date').value,
    dropoffTime: document.getElementById('offer-dropoff-time').value,
    pricePerDay: document.getElementById('offer-price-day').value.trim(),
    optionIds: modal.payload.optionIds,
    link: document.getElementById('offer-link').value.trim(),
    notes: document.getElementById('offer-notes').value.trim(),
  };

  if (id) {
    const idx = state.offers.findIndex((c) => c.id === id);
    state.offers[idx] = offer;
  } else {
    state.offers.push(offer);
  }
  if (modal.scenarioId) applyScenarioOffer(getScenario(modal.scenarioId), offer.id);
  saveNow();
  closeModal();
}

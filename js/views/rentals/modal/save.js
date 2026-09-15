/*
  Le modèle choisi remplace le nom repris d'avant le catalogue : deux noms diraient la même chose.
  Le seul prix qui se saisit est le total, celui que le loueur affiche pour ses dates. Le tarif
  journalier d'une offre relevée avant les locations se garde tel quel — il n'a pas de dates d'où
  se recalculer — mais rien n'en écrit de nouveau.
*/
function saveOffer(id) {
  const existing = id ? getOffer(id) : null;
  const modelId = document.getElementById('car-model').value;
  const offer = {
    ...emptyOffer(),
    id: id || uid(),
    travelId: currentTravelId(),
    isDefault: !!(existing && existing.isDefault),
    pricePerDay: (existing || {}).pricePerDay || '',
    model: modelId ? '' : (existing || {}).model || '',
    rentalId: document.getElementById('car-rental').value,
    modelId,
    status: carStatusKey(document.getElementById('car-status').value),
    priceTotal: document.getElementById('car-price-total').value.trim(),
    optionIds: modal.payload.optionIds,
    link: document.getElementById('car-link').value.trim(),
    notes: document.getElementById('car-notes').value.trim(),
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

/*
  Le modèle choisi remplace le nom repris d'avant le catalogue : deux noms diraient la même chose.
  Les deux prix se saisissent : le loueur affiche un total pour ses dates, mais une offre relevée
  sans dates n'a que son tarif journalier — et c'est lui qu'un scénario multiplie par ses jours.
*/
function saveOffer(id) {
  const existing = id ? getOffer(id) : null;
  const modelId = document.getElementById('car-model').value;
  const offer = {
    ...emptyOffer(),
    id: id || uid(),
    travelId: currentTravelId(),
    isDefault: !!(existing && existing.isDefault),
    pricePerDay: document.getElementById('car-price-day').value.trim(),
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
  saveNow();
  closeModal();
}

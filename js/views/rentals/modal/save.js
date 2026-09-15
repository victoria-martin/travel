// Le modèle choisi remplace le nom repris d'avant le catalogue : deux noms diraient la même chose.
function saveCar(id) {
  const existing = id ? getCar(id) : null;
  const modelId = document.getElementById('car-model').value;
  const car = {
    ...emptyCar(),
    id: id || uid(),
    travelId: currentTravelId(),
    isDefault: !!(existing && existing.isDefault),
    pricePerDay: existing ? existing.pricePerDay : '',
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
    const idx = state.cars.findIndex((c) => c.id === id);
    state.cars[idx] = car;
  } else {
    state.cars.push(car);
  }
  saveNow();
  closeModal();
}

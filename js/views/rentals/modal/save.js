function saveCar(id) {
  const existing = id ? getCar(id) : null;
  const car = {
    ...emptyCar(),
    id: id || uid(),
    travelId: currentTravelId(),
    isDefault: !!(existing && existing.isDefault),
    pricePerDay: existing ? existing.pricePerDay : '',
    rentalId: document.getElementById('car-rental').value,
    status: carStatusKey(document.getElementById('car-status').value),
    model: document.getElementById('car-model').value.trim(),
    fuel: carFuelKey(document.getElementById('car-fuel').value),
    gearbox: carGearboxKey(document.getElementById('car-gearbox').value),
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

function saveCar(id) {
  const existing = id ? getCar(id) : null;
  const car = {
    id: id || uid(),
    travelId: currentTravelId(),
    isDefault: !!(existing && existing.isDefault),
    name: document.getElementById('car-name').value.trim(),
    model: document.getElementById('car-model').value.trim(),
    pricePerDay: document.getElementById('car-price-per-day').value.trim(),
    priceTotal: document.getElementById('car-price-total').value.trim(),
    dates: document.getElementById('car-dates').value.trim(),
    location: document.getElementById('car-location').value.trim(),
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

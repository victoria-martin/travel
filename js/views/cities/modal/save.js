function readCityForm(id) {
  const located = readLocateFields();
  const name = document.getElementById('c-name').value.trim() || 'Sans nom';
  return {
    id: id || uid(),
    travelId: currentTravelId(),
    name,
    address: located.address,
    ...placeLevelsOf(located),
    city: located.city || name,
    lat: located.lat,
    lng: located.lng,
    notes: document.getElementById('c-notes').value.trim(),
  };
}

function upsertCity(item) {
  const idx = state.cities.findIndex((c) => c.id === item.id);
  if (idx === -1) state.cities.push(item);
  else state.cities[idx] = item;
  saveNow();
}

function saveCity(id) {
  upsertCity(readCityForm(id));
  closeModal();
}

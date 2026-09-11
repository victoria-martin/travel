function readCityForm(id) {
  const located = readLocateFields();
  return {
    id: id || uid(),
    travelId: currentTravelId(),
    name: document.getElementById('c-name').value.trim() || 'Sans nom',
    geoAddress: located.geoAddress,
    lat: located.lat,
    lng: located.lng,
    county: located.county,
    region: located.region,
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

function saveCity(id) {
  const located = readLocateFields();
  const item = {
    id: id || uid(),
    name: document.getElementById('c-name').value.trim() || 'Sans nom',
    geoAddress: located.geoAddress,
    lat: located.lat,
    lng: located.lng,
    county: located.county,
    region: located.region,
    notes: document.getElementById('c-notes').value.trim(),
  };

  if (id) {
    const idx = state.cities.findIndex((c) => c.id === id);
    state.cities[idx] = item;
  } else {
    state.cities.push(item);
  }
  saveNow();
  closeModal();
}

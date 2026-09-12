function readAttractionForm(id) {
  const located = readLocateFields();
  return {
    id: id || uid(),
    travelId: currentTravelId(),
    name: document.getElementById('a-name').value.trim() || 'Sans nom',
    type: document.getElementById('a-type').value,
    status: document.getElementById('a-status').value,
    description: document.getElementById('a-description').value.trim(),
    geoAddress: located.geoAddress,
    lat: located.lat,
    lng: located.lng,
    city: located.city,
    county: located.county,
    region: located.region,
    link: document.getElementById('a-link').value.trim(),
    tags: [...modal.payload.tags],
    favorite: document.getElementById('a-favorite').checked,
  };
}

function upsertAttraction(item) {
  const idx = state.attractions.findIndex((a) => a.id === item.id);
  if (idx === -1) state.attractions.push(item);
  else state.attractions[idx] = item;
  saveNow();
}

function saveAttraction(id) {
  upsertAttraction(readAttractionForm(id));
  closeModal();
}

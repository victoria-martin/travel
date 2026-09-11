function readAccommodationForm(id) {
  const located = readLocateFields();
  return {
    id: id || uid(),
    travelId: currentTravelId(),
    type: document.getElementById('f-type').value,
    status: document.getElementById('f-status').value,
    name: document.getElementById('f-name').value.trim() || 'Sans nom',
    address: document.getElementById('f-address').value.trim(),
    geoAddress: located.geoAddress,
    city: located.city,
    county: located.county,
    region: located.region,
    lat: located.lat,
    lng: located.lng,
    price: document.getElementById('f-price').value.trim(),
    dates: document.getElementById('f-dates').value.trim(),
    link: document.getElementById('f-link').value.trim(),
    bookingLink: document.getElementById('f-booking-link').value.trim(),
    notes: document.getElementById('f-notes').value.trim(),
    tags: [...modal.payload.tags],
    favorite: document.getElementById('f-favorite').checked,
  };
}

function upsertAccommodation(item) {
  const idx = state.accommodations.findIndex((a) => a.id === item.id);
  if (idx === -1) state.accommodations.push(item);
  else state.accommodations[idx] = item;
  saveNow();
}

function saveAccommodation(id) {
  upsertAccommodation(readAccommodationForm(id));
  closeModal();
}

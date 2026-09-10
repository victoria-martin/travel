function saveAccommodation(id) {
  const located = readLocateFields();
  const item = {
    id: id || uid(),
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
    favorite: document.getElementById('f-favorite').checked,
  };

  if (id) {
    const idx = state.accommodations.findIndex((a) => a.id === id);
    state.accommodations[idx] = item;
  } else {
    state.accommodations.push(item);
  }
  saveNow();
  closeModal();
}

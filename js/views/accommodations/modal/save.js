async function saveAccommodation(id) {
  const previous = id ? getAccommodation(id) : null;
  const address = document.getElementById('f-address').value.trim();
  const geoAddress = document.getElementById('f-geo-address').value.trim();
  const item = {
    id: id || uid(),
    type: document.getElementById('f-type').value,
    status: document.getElementById('f-status').value,
    name: document.getElementById('f-name').value.trim() || 'Sans nom',
    address,
    geoAddress,
    city: previous ? previous.city : '',
    county: previous ? previous.county : '',
    region: previous ? previous.region : '',
    lat: previous ? previous.lat : '',
    lng: previous ? previous.lng : '',
    price: document.getElementById('f-price').value.trim(),
    dates: document.getElementById('f-dates').value.trim(),
    link: document.getElementById('f-link').value.trim(),
    bookingLink: document.getElementById('f-booking-link').value.trim(),
    notes: document.getElementById('f-notes').value.trim(),
    favorite: document.getElementById('f-favorite').checked,
  };

  const needsGeocoding =
    geoAddress && (!previous || previous.geoAddress !== geoAddress || !previous.lat);
  if (needsGeocoding) {
    setGeocodeStatus("⏳ Localisation de l'adresse…", true);
    const found = await geocodeAddress(geoAddress);
    if (found) Object.assign(item, found);
    else {
      Object.assign(item, { lat: '', lng: '', city: '', county: '', region: '' });
      setGeocodeStatus('⚠️ Adresse introuvable — enregistrée sans position.', false);
    }
  } else if (!geoAddress) {
    Object.assign(item, { lat: '', lng: '', city: '', county: '', region: '' });
  }

  if (id) {
    const idx = state.accommodations.findIndex((a) => a.id === id);
    state.accommodations[idx] = item;
  } else {
    state.accommodations.push(item);
  }
  saveNow();
  closeModal();
}

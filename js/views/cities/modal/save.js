async function saveCity(id) {
  const previous = id ? getCity(id) : null;
  const geoAddress = document.getElementById('c-geo-address').value.trim();
  const item = {
    id: id || uid(),
    name: document.getElementById('c-name').value.trim() || 'Sans nom',
    geoAddress,
    lat: document.getElementById('c-lat').value.trim(),
    lng: document.getElementById('c-lng').value.trim(),
    county: previous ? previous.county : '',
    region: previous ? previous.region : '',
    notes: document.getElementById('c-notes').value.trim(),
  };

  // Les coordonnées saisies à la main font foi : on ne géocode que si l'adresse est
  // nouvelle et qu'aucune position n'a été tapée.
  const geoAddressIsNew = !previous || previous.geoAddress !== geoAddress;
  if (geoAddress && geoAddressIsNew && !(item.lat && item.lng)) {
    setGeocodeStatus("⏳ Localisation de l'adresse…", true);
    const found = await geocodeAddress(geoAddress);
    if (found)
      Object.assign(item, {
        lat: found.lat,
        lng: found.lng,
        county: found.county,
        region: found.region,
      });
    else setGeocodeStatus('⚠️ Adresse introuvable — enregistrée sans position.', false);
  }

  if (id) {
    const idx = state.cities.findIndex((c) => c.id === id);
    state.cities[idx] = item;
  } else {
    state.cities.push(item);
  }
  saveNow();
  closeModal();
}

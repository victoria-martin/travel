/*
  Les portes d'ajout n'affichent que leurs champs : celui qui n'est pas dans le DOM garde la valeur
  que la fiche portait déjà.
*/
function accommodationFieldValue(id, kept) {
  const field = document.getElementById(id);
  return field ? field.value.trim() : kept || '';
}

function readAccommodationForm(id) {
  const p = modal.payload;
  const located = readLocateFields();
  if (located.city) upsertVilleByName(currentTravelId(), located.city);
  const favorite = document.getElementById('f-favorite');
  return {
    id: id || uid(),
    travelId: currentTravelId(),
    type: accommodationFieldValue('f-type', p.type),
    status: accommodationFieldValue('f-status', p.status),
    name: accommodationFieldValue('f-name', p.name) || 'Sans nom',
    address: located.address,
    ...placeLevelsOf(located),
    lat: located.lat,
    lng: located.lng,
    price: accommodationFieldValue('f-price', p.price),
    dates: accommodationFieldValue('f-dates', p.dates),
    availableFrom: accommodationFieldValue('f-available-from', p.availableFrom),
    availableTo: accommodationFieldValue('f-available-to', p.availableTo),
    searchDate: p.searchDate || '',
    link: accommodationFieldValue('f-link', p.link),
    bookingLink: accommodationFieldValue('f-booking-link', p.bookingLink),
    mapsLink: accommodationFieldValue('f-maps-link', p.mapsLink),
    notes: accommodationFieldValue('f-notes', p.notes),
    tags: [...p.tags],
    favorite: favorite ? favorite.checked : p.favorite,
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

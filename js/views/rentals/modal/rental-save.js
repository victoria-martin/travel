function upsertRental(item) {
  const idx = state.rentals.findIndex((r) => r.id === item.id);
  if (idx === -1) state.rentals.push(item);
  else state.rentals[idx] = item;
  saveNow();
}

function readRentalForm(id) {
  return {
    id: id || uid(),
    travelId: currentTravelId(),
    providerId: document.getElementById('rental-provider').value,
    location: document.getElementById('rental-location').value.trim(),
    pickupDate: document.getElementById('rental-pickup-date').value,
    pickupTime: document.getElementById('rental-pickup-time').value,
    dropoffDate: document.getElementById('rental-dropoff-date').value,
    dropoffTime: document.getElementById('rental-dropoff-time').value,
    link: document.getElementById('rental-link').value.trim(),
    notes: document.getElementById('rental-notes').value.trim(),
  };
}

// Une recherche neuve s'ouvre sur sa ligne de saisie : c'est là qu'on recopie la liste du loueur.
function saveRental(id) {
  const rental = readRentalForm(id);
  upsertRental(rental);
  openRental(rental.id);
  if (!id) draftRentalId = rental.id;
  closeModal();
  focusVehicleDraft();
}

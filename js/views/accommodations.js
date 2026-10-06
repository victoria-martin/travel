function toggleFavorite(id) {
  const a = getAccommodation(id);
  a.favorite = !a.favorite;
  saveNow();
  render();
}

// dans dossier  accomodation/type/ ou
function setAccommodationType(id, type) {
  getAccommodation(id).type = type;
  saveNow();
  render();
}

function setAccommodationStatus(id, status) {
  getAccommodation(id).status = status;
  saveNow();
  render();
}

function setAccommodationCheckInTime(id, checkInTime) {
  getAccommodation(id).checkInTime = checkInTime;
  saveNow();
  render();
}

// Add filters

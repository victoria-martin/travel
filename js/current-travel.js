/*
  Le voyage ouvert est une préférence locale (js/prefs.js) : chacun ouvre le sien dans son
  navigateur, rien n'en part dans le Sheet. Toutes les vues lisent ses données à travers
  ofCurrentTravel().
*/

function currentTravelId() {
  if (prefs.travelId) return prefs.travelId;
  return state.travels.length ? state.travels[0].id : null;
}

function currentTravel() {
  return getTravel(currentTravelId());
}

function openTravel(id) {
  prefs.travelId = id;
  persistPrefs();
}

function ofCurrentTravel(items) {
  const travelId = currentTravelId();
  return (items || []).filter((item) => item.travelId === travelId);
}

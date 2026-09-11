/*
  The open travel is a local preference (js/prefs.js): everyone opens their own in their own
  browser, nothing about it reaches the Sheet. Every view reads its data through ofCurrentTravel().
*/

// A preference naming a travel that is gone would empty every screen: fall back to the first.
function currentTravelId() {
  const known = state.travels.some((t) => t.id === prefs.travelId);
  if (known) return prefs.travelId;
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

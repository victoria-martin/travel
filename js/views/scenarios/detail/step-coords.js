function stepPlace(step) {
  if (step.cityId) return getCity(step.cityId) || null;
  if (step.accommodationId) return getAccommodation(step.accommodationId) || null;
  return null;
}

function coordsFor(step) {
  const place = stepPlace(step);
  if (place && place.lat && place.lng) return [parseFloat(place.lat), parseFloat(place.lng)];
  return null;
}

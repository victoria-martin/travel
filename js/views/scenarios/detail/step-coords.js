function optionPlace(option) {
  if (option.cityId) return getCity(option.cityId) || null;
  if (option.accommodationId) return getAccommodation(option.accommodationId) || null;
  return null;
}

function stepPlace(step) {
  return optionPlace(chosenOption(step));
}

function coordsFor(step) {
  const place = stepPlace(step);
  if (place && place.lat && place.lng) return [parseFloat(place.lat), parseFloat(place.lng)];
  return null;
}

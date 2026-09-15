/*
  Le prix saisi est le total du loueur pour ce véhicule sur toute la location ; le prix par jour
  s'en déduit, il ne se tape jamais. Une voiture reprise d'avant les locations n'a parfois que son
  prix par jour et aucune date : il reste alors le seul chiffre connu, et c'est lui qui répond.
*/
function vehicleDayPrice(car) {
  const days = rentalDays(vehicleRental(car));
  if (days && hasPriceValue(car.priceTotal)) return priceNumber(car.priceTotal) / days;
  return priceNumber(car.pricePerDay);
}

function vehiclePrice(car) {
  if (hasPriceValue(car.priceTotal)) return priceNumber(car.priceTotal);
  return priceNumber(car.pricePerDay) * (rentalDays(vehicleRental(car)) || 1);
}

const OPTION_REPEATS = {
  day: (rental) => rentalDays(rental) || 1,
  traveler: () => travelerCount() || 1,
};

function optionAmount(option, rental) {
  const repeat = OPTION_REPEATS[providerOptionUnit(option.unit).per];
  return priceNumber(option.amount) * (repeat ? repeat(rental) : 1);
}

function vehicleOptions(car) {
  const provider = getProvider(vehicleRental(car).providerId);
  if (!provider) return [];
  return (car.optionIds || [])
    .map((id) => provider.options.find((option) => option.id === id))
    .filter(Boolean);
}

function vehicleOptionsTotal(car) {
  const rental = vehicleRental(car);
  return vehicleOptions(car).reduce((total, option) => total + optionAmount(option, rental), 0);
}

function vehicleTotal(car) {
  return vehiclePrice(car) + vehicleOptionsTotal(car);
}

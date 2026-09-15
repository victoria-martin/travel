/*
  Le prix saisi est le total du loueur pour ce véhicule sur toute la location ; le prix par jour
  s'en déduit, il ne se tape jamais. Une voiture reprise d'avant les locations n'a parfois que son
  prix par jour et aucune date : il reste alors le seul chiffre connu, et c'est lui qui répond.
*/
function offerDayPrice(offer) {
  const days = rentalDays(offerRental(offer));
  if (days && hasPriceValue(offer.priceTotal)) return priceNumber(offer.priceTotal) / days;
  return priceNumber(offer.pricePerDay);
}

function offerPrice(offer) {
  if (hasPriceValue(offer.priceTotal)) return priceNumber(offer.priceTotal);
  return priceNumber(offer.pricePerDay) * (rentalDays(offerRental(offer)) || 1);
}

function offerOptions(offer) {
  return providerOptions(offerRental(offer).providerId, offer.optionIds);
}

function offerOptionsTotal(offer) {
  return optionsTotal(offerOptions(offer), rentalDays(offerRental(offer)));
}

function offerTotal(offer) {
  return offerPrice(offer) + offerOptionsTotal(offer);
}

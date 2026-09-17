/*
  Le seul prix qui se saisit est le prix par jour que le loueur affiche : un total n'a de sens que
  sur une durée, et la durée appartient au scénario qui lit l'offre. Les options sont celles du
  catalogue de son loueur — leur montant ne vit qu'à cet endroit.
*/
function offerDayPrice(offer) {
  return priceNumber(offer.pricePerDay);
}

function offerDayPriceLabel(offer) {
  const day = offerDayPrice(offer);
  return day ? `${formatEuros(day)} / jour` : '—';
}

function offerOptions(offer) {
  return providerOptions(offer.providerId, offer.optionIds);
}

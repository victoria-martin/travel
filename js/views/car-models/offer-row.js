/*
  Une offre est un véhicule d'une location : son loueur et ses dates la situent, ses options la
  distinguent de l'offre d'à côté — deux offres du même loueur ne diffèrent parfois que par une
  assurance, et c'est exactement ce qu'on vient comparer.
*/
function carModelOfferRow(offer) {
  const rental = offerRental(offer);
  return /* HTML */ `<div class="offer-row">
    ${defaultOfferCell(offer)}
    <span class="offer-provider">${escapeHtml(providerName(rental.providerId)) || '—'}</span>
    <span class="offer-dates">${escapeHtml(rentalDatesLabel(rental).join(' · '))}</span>
    ${offerStatusTag(offer)}
    <span class="offer-options">${offerOptionLabels(offer)}</span>
    <span class="offer-price">${offerPriceLabels(offer).join(' · ')}</span>
    <span class="rental-offer-actions">${editButton('voiture', offer.id)}</span>
  </div>`;
}

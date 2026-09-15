/*
  Une offre est un véhicule d'une location : son loueur et ses dates la situent, ses options la
  distinguent de l'offre d'à côté — deux offres du même loueur ne diffèrent parfois que par une
  assurance, et c'est exactement ce qu'on vient comparer.
*/
function carModelOfferRow(car) {
  const rental = vehicleRental(car);
  return /* HTML */ `<div class="offer-row">
    ${defaultCarCell(car)}
    <span class="offer-provider">${escapeHtml(providerName(rental.providerId)) || '—'}</span>
    <span class="offer-dates">${escapeHtml(rentalDatesLabel(rental).join(' · '))}</span>
    ${carStatusTag(car)}
    <span class="offer-options">${vehicleOptionLabels(car)}</span>
    <span class="offer-price">${carPriceLabels(car).join(' · ')}</span>
    <span class="vehicle-actions">${editButton('voiture', car.id)}</span>
  </div>`;
}

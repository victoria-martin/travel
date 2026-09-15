function rentalCard(rental) {
  const offers = rentalOffers(rental.id);
  const open = isRentalOpen(rental.id);
  return /* HTML */ `<div class="rental-card">
    <button class="rental-head" onclick="toggleRental('${rental.id}')">
      <span class="rental-title">${svgIcon('car')} ${escapeHtml(rentalLabel(rental))}</span>
      <span class="rental-dates">${escapeHtml(rentalDatesLabel(rental).join(' · '))}</span>
      <span class="rental-count">
        ${offers.length} véhicule${offers.length > 1 ? 's' : ''}
        ${svgIcon(open ? 'chevron-down' : 'chevron-right')}
      </span>
    </button>
    <div class="rental-actions">
      ${editButton('location', rental.id)}${deleteButton('rentals', rental.id)}
    </div>
    ${open ? rentalOfferRows(rental, offers) : ''}
  </div>`;
}

function rentalOfferRows(rental, offers) {
  return /* HTML */ `<div class="rental-offers">
    ${offers.map(offerRow).join('')} ${offerDraftRow(rental.id)}
  </div>`;
}

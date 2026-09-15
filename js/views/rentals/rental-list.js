// Les locations se lisent dans l'ordre où on les prendra, celles sans date à la fin.
function rentalList(rentals) {
  return /* HTML */ `<div class="rental-list">
    ${rentals
      .sort((a, b) => (a.pickupDate || '9999').localeCompare(b.pickupDate || '9999'))
      .map(rentalCard)
      .join('')}
  </div>`;
}

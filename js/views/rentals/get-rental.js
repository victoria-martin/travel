function getRental(id) {
  return state.rentals.find((r) => r.id === id);
}

function rentalOffers(rentalId) {
  return state.offers.filter((c) => c.rentalId === rentalId);
}

function offerRental(offer) {
  return getRental(offer.rentalId) || {};
}

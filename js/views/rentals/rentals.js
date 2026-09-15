function renderRentalsView() {
  const rentals = ofCurrentTravel(state.rentals);
  return /* HTML */ `
    ${rentalsHeader(rentals)}
    ${
      rentals.length === 0
        ? emptyState(
            'Aucune location',
            'Commence par une recherche : un loueur, un lieu, des dates.',
          )
        : rentalList(rentals)
    }
  `;
}

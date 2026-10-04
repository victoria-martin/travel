function emptyAttraction() {
  return {
    id: null,
    name: '',
    type: '',
    status: 'toSort',
    description: '',
    address: '',
    ...emptyPlaceLevels(),
    lat: '',
    lng: '',
    accommodationId: '',
    mapsLink: '',
    link: '',
    hours: '',
    phone: '',
    budget: '',
    amountMin: '',
    amountMax: '',
    tags: [],
    favorite: false,
    createdAt: '',
    updatedAt: '',
  };
}

// Formulaire : src/domains/attractions/modal/AttractionModal.tsx (docs/en-cours/react-migration-plan.md § 4).
function attractionAccommodations() {
  return ofCurrentTravel(state.accommodations).sort(
    (a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0) || a.name.localeCompare(b.name),
  );
}

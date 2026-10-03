function emptyAccommodation() {
  return {
    id: null,
    type: '',
    status: '',
    name: '',
    address: '',
    ...emptyPlaceLevels(),
    lat: '',
    lng: '',
    price: '',
    dates: '',
    checkInTime: '',
    availableFrom: '',
    availableTo: '',
    searchDate: '',
    link: '',
    bookingLink: '',
    mapsLink: '',
    notes: '',
    tags: [],
    favorite: false,
    createdAt: '',
    updatedAt: '',
  };
}

// body : React (src/domains/accommodations/modal/AccommodationModal.tsx, src/modal-bodies.ts).

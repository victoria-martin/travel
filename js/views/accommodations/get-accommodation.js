function getAccommodation(id) {
  return state.accommodations.find((a) => a.id === id);
}

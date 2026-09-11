function getTravel(id) {
  return state.travels.find((t) => t.id === id) || null;
}

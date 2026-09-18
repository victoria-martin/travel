function getPackingListItem(id) {
  return state.packingListItems.find((i) => i.id === id);
}

function travelPackingItems() {
  return ofCurrentTravel(state.packingListItems);
}

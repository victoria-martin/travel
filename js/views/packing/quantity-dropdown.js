function setPackingQuantity(id, n) {
  openInlineMenu = null;
  const item = getPackingListItem(id);
  item.quantity = n;
  item.perNight = false;
  saveNow();
  render();
}

function setPackingPerNight(id) {
  openInlineMenu = null;
  getPackingListItem(id).perNight = true;
  saveNow();
  render();
}

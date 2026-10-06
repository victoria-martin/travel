function setOfferStatus(id, status) {
  getOffer(id).status = status;
  saveNow();
  render();
}

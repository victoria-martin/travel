function setOfferNotes(id, notes) {
  const value = notes.trim();
  getOffer(id).notes = value;
  saveNow();
  syncEditable(`offer:${id}:notes`, value);
}

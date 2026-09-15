function offerNotesEditable(offer) {
  return editableText(offer.notes, `setOfferNotes('${offer.id}', this.innerText)`, {
    key: `offer:${offer.id}:notes`,
    placeholder: 'Notes…',
  });
}

function setOfferNotes(id, notes) {
  const value = notes.trim();
  getOffer(id).notes = value;
  saveNow();
  syncEditable(`offer:${id}:notes`, value);
}

function carNotesEditable(car) {
  return editableText(car.notes, `setCarNotes('${car.id}', this.innerText)`, {
    key: `car:${car.id}:notes`,
    placeholder: 'notes…',
  });
}

function setCarNotes(id, notes) {
  const value = notes.trim();
  getCar(id).notes = value;
  saveNow();
  syncEditable(`car:${id}:notes`, value);
}

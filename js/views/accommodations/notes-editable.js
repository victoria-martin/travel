function notesEditable(a) {
  return editableText(a.notes, `setAccommodationNotes('${a.id}', this.innerText)`, {
    key: `accommodation:${a.id}:notes`,
    placeholder: 'notes…',
  });
}

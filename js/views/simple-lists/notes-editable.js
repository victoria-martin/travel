function simpleNotesEditable(kind, item) {
  return editableText(item.notes, `setSimpleNotes('${kind}', '${item.id}', this.innerText)`, {
    key: `${SIMPLE_CONFIG[kind].dataKey}:${item.id}:notes`,
    placeholder: 'notes…',
  });
}

function setSimpleNotes(kind, id, notes) {
  const value = notes.trim();
  getSimple(kind, id).notes = value;
  saveNow();
  syncEditable(`${SIMPLE_CONFIG[kind].dataKey}:${id}:notes`, value);
}

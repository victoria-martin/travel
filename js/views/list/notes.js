function listNotesEditable(kind, item) {
  return editableText(item.notes, `setListNotes('${kind}', '${item.id}', this.innerText)`, {
    key: `${LIST_CONFIG[kind].dataKey}:${item.id}:notes`,
    placeholder: 'notes…',
  });
}

function setListNotes(kind, id, notes) {
  const value = notes.trim();
  getListItem(kind, id).notes = value;
  saveNow();
  syncEditable(`${LIST_CONFIG[kind].dataKey}:${id}:notes`, value);
}

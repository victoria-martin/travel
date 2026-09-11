function fixedCostNotesEditable(cost) {
  return editableText(cost.notes, `setFixedCostNotes('${cost.id}', this.innerText)`, {
    key: `fixed-cost:${cost.id}:notes`,
    placeholder: 'notes…',
  });
}

function setFixedCostNotes(id, notes) {
  const value = notes.trim();
  getFixedCost(id).notes = value;
  saveNow();
  syncEditable(`fixed-cost:${id}:notes`, value);
}

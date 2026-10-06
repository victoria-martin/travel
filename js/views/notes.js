/*
  One note per travel, stored as a one-entry collection: it then goes through the per-id merge of
  js/sync.js like the rest of the state.
*/

function tripNote() {
  return ofCurrentTravel(state.tripNotes)[0] || null;
}

// Saisie sans re-render : re-rendre arracherait le champ et le curseur à chaque frappe.
function setTripNote(text) {
  const note = tripNote();
  if (note) {
    note.text = text;
    note.updatedAt = new Date().toISOString();
  } else {
    state.tripNotes.push({
      id: uid(),
      travelId: currentTravelId(),
      text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  saveNow();
}

/*
  Un seul bloc-notes, stocké comme une collection d'une entrée : il passe ainsi par la
  fusion par id de js/sync.js, comme le reste de l'état.
*/

const TRIP_NOTE_ID = 'trip';

function tripNote() {
  return (state.tripNotes || []).find((n) => n.id === TRIP_NOTE_ID) || null;
}

function renderNotesView() {
  const note = tripNote();
  return /* HTML */ `
    <div class="view-header">
      <div>
        <h2 class="view-title">Notes</h2>
        <p class="view-sub">Bloc-notes libre, partagé via le Sheet</p>
      </div>
    </div>
    <textarea
      class="notes-area"
      placeholder="Idées, liens, questions à trancher…"
      oninput="setTripNote(this.value)"
    >
${escapeHtml(note && note.text)}</textarea>
  `;
}

// Saisie sans re-render : re-rendre arracherait le champ et le curseur à chaque frappe.
function setTripNote(text) {
  const note = tripNote();
  if (note) note.text = text;
  else state.tripNotes.push({ id: TRIP_NOTE_ID, text });
  saveNow();
}

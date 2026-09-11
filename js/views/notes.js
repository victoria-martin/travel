/*
  Un bloc-notes par voyage, stocké comme une collection d'une entrée : il passe ainsi par la
  fusion par id de js/sync.js, comme le reste de l'état.
*/

function tripNote() {
  return ofCurrentTravel(state.tripNotes)[0] || null;
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
  else state.tripNotes.push({ id: uid(), travelId: currentTravelId(), text });
  saveNow();
}

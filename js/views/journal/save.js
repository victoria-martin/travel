function upsertJournalEntry(date, patch) {
  const travelId = currentTravelId();
  let entry = getJournalEntry(travelId, date);
  if (!entry) {
    entry = { id: uid(), travelId, date, scenarioId: prefs.journalScenarioId || '', photos: [], text: '' };
    state.journalEntries.push(entry);
  }
  Object.assign(entry, patch);
  return entry;
}

// Saisie sans re-render : re-rendre arracherait le champ et le curseur à chaque frappe.
function setJournalTextQuiet(date, text) {
  upsertJournalEntry(date, { text });
  saveNow();
}

function addJournalPhoto(date, url) {
  const entry = upsertJournalEntry(date, {});
  entry.photos.push(url);
  saveNow();
  render();
}

function removeJournalPhoto(date, url) {
  const entry = upsertJournalEntry(date, {});
  entry.photos = entry.photos.filter((p) => p !== url);
  saveNow();
  render();
}

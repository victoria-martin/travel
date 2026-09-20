// Une entrée par jour et par voyage : la date est la clé, pas un id qu'on aurait à retrouver.
function getJournalEntry(travelId, date) {
  return state.journalEntries.find((e) => e.travelId === travelId && e.date === date) || null;
}

function journalEntriesForTravel(travelId) {
  return state.journalEntries.filter((e) => e.travelId === travelId);
}

/*
  Un seul onglet (la carte du jour) ouvert ou aucun ; sous 640px le même bouton ouvre un sheet
  plutôt que de pousser le contenu sous l'éditeur.
*/
function onJournalPanelToggle(date, key) {
  if (window.matchMedia('(max-width: 639px)').matches) openSheet('journal-panel', date, key);
  else toggleJournalSidePanel(key);
}

function toggleJournalSidePanel(key) {
  prefs.journalSidePanel = prefs.journalSidePanel === key ? null : key;
  persistPrefs();
  renderWithTransition();
}

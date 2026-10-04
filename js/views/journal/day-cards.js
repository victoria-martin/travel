/*
  Une carte par jour, en rang scrollable pleine largeur — sur le patron des cartes météo du détail
  d'un scénario (js/views/scenarios/detail/header.js, .scenario-weather-day). Les jours viennent du
  scénario choisi (départ + nuits cumulées, journal/scenario-days.js) ; une entrée déjà écrite hors
  de cette plage — un jour ajouté à la main, ou un ancien scénario — reste dans le rang.
*/
function selectJournalDay(date) {
  prefs.journalDate = date;
  persistPrefs();
  render();
}

function promptJournalDay() {
  const date = window.prompt('Date du jour à ajouter (aaaa-mm-jj) :', prefs.journalDate || '');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
  upsertJournalEntry(date, {});
  saveNow();
  selectJournalDay(date);
}

/*
  Une carte par jour, en rang scrollable pleine largeur — sur le patron des cartes météo du détail
  d'un scénario (js/views/scenarios/detail/header.js, .scenario-weather-day). Les jours viennent du
  scénario choisi (départ + nuits cumulées, journal/scenario-days.js) ; une entrée déjà écrite hors
  de cette plage — un jour ajouté à la main, ou un ancien scénario — reste dans le rang.
*/
function journalDayList(scenario) {
  const scenarioDays = scenario ? journalScenarioDays(scenario) : [];
  const entryDays = journalEntriesForTravel(currentTravelId()).map((e) => e.date);
  return Array.from(new Set([...scenarioDays, ...entryDays])).sort();
}

function journalDayCards(scenario) {
  const days = journalDayList(scenario);
  return /* HTML */ `<div class="journal-day-cards">
    ${days.map((date, i) => journalDayCard(scenario, date, i)).join('')}
    <button class="journal-day-card journal-day-add" onclick="promptJournalDay()">
      ${svgIcon('plus')}<span>Jour</span>
    </button>
  </div>`;
}

function journalDayCard(scenario, date, i) {
  const entry = getJournalEntry(currentTravelId(), date);
  const active = date === prefs.journalDate;
  const d = isoToDate(date);
  return /* HTML */ `<button class="journal-day-card ${active ? 'active' : ''}" onclick="selectJournalDay('${date}')">
    <span class="journal-day-card-number">Jour ${i + 1}</span>
    <span class="journal-day-card-date">${d ? formatStepDate(d) : date}</span>
    ${entry && (entry.text || entry.photos.length)
      ? /* HTML */ `<span class="journal-day-card-dot" title="Entrée écrite"></span>`
      : ''}
  </button>`;
}

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

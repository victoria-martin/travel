/*
  Le journal se date sur un scénario choisi (comme la carte, prefs.journalScenarioId) : c'est lui
  qui donne les jours du séjour et les activités déjà planifiées à proposer. Un seul jour s'édite à
  la fois (prefs.journalDate), les cartes du haut le changent.
*/
function journalScenarioOptions() {
  return ofCurrentTravel(state.scenarios);
}

function setJournalScenario(id) {
  prefs.journalScenarioId = id;
  const scenario = getScenario(id);
  const days = scenario ? journalScenarioDays(scenario) : [];
  if (days.length && !days.includes(prefs.journalDate)) prefs.journalDate = days[0];
  persistPrefs();
  render();
}

function journalScenarioPicker() {
  const scenarios = journalScenarioOptions();
  return /* HTML */ `<select class="journal-scenario-select" onchange="setJournalScenario(this.value)">
    <option value="">— Choisir un scénario —</option>
    ${scenarios
      .map(
        (s) =>
          `<option value="${s.id}" ${s.id === prefs.journalScenarioId ? 'selected' : ''}>${escapeHtml(s.name)}</option>`,
      )
      .join('')}
  </select>`;
}

// Présélectionné sur le scénario choisi (chosen.js), une fois : le choix reste ensuite libre, y
// compris pour revenir à « aucun » — sans quoi ce défaut s'imposerait à chaque rendu.
function defaultJournalScenarioId() {
  if (prefs.journalScenarioId !== undefined) return prefs.journalScenarioId;
  const chosen = chosenScenario();
  prefs.journalScenarioId = chosen ? chosen.id : '';
  persistPrefs();
  return prefs.journalScenarioId;
}

function renderJournalView() {
  const scenario = defaultJournalScenarioId() ? getScenario(prefs.journalScenarioId) : null;
  if (scenario && !prefs.journalDate) {
    const days = journalScenarioDays(scenario);
    if (days.length) prefs.journalDate = days[0];
  }
  const date = prefs.journalDate;
  return /* HTML */ `
    <div class="view-header">
      <div>
        <h2 class="view-title">Journal</h2>
        <p class="view-sub">Un carnet de bord, jour par jour</p>
      </div>
      <div class="view-header-actions">
        ${journalScenarioPicker()} ${toolbarSeparator()} ${journalSideTabsButtons(date || '')}
      </div>
    </div>
    ${journalDayCards(scenario)}
    ${!scenario
      ? emptyState('Choisis un scénario', 'Les jours du journal se datent sur le séjour d’un scénario.')
      : !date
        ? emptyState('Aucun jour', 'Ajoute un jour depuis le rang ci-dessus.')
        : journalDayPanel(scenario, date)}
  `;
}

function journalDayPanel(scenario, date) {
  return /* HTML */ `<div class="journal-cols">
    <div class="journal-main view-scroller">
      ${journalPlannedPillsHtml(scenario, date)} ${journalEditorBlock(date)}
    </div>
    ${prefs.journalSidePanel
      ? /* HTML */ `<div class="journal-side">
          ${JOURNAL_SIDE_TABS.find((t) => t.key === prefs.journalSidePanel).body(date)}
        </div>`
      : ''}
  </div>`;
}

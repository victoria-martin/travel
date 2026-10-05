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

// Présélectionné sur le scénario choisi (chosen.js), une fois : le choix reste ensuite libre, y
// compris pour revenir à « aucun » — sans quoi ce défaut s'imposerait à chaque rendu.
function defaultJournalScenarioId() {
  if (prefs.journalScenarioId !== undefined) return prefs.journalScenarioId;
  const chosen = chosenScenario();
  prefs.journalScenarioId = chosen ? chosen.id : '';
  persistPrefs();
  return prefs.journalScenarioId;
}

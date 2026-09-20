/*
  Le journal se date sur le scénario choisi : chaque jour de son séjour (départ + nuits cumulées de
  ses étapes visibles) devient une carte, qu'il y ait ou non une entrée écrite ce jour-là.
*/
function journalScenarioDays(scenario) {
  const days = totalDays(scenario);
  const start = scenarioStart(scenario);
  if (!days || !start) return [];
  return Array.from({ length: days }, (_, n) => dateToIso(dateAfter(start, n)));
}

// L'étape (visible) dont la fenêtre [arrivée, arrivée+nuits) couvre cette date, s'il y en a une.
function stepForJournalDay(scenario, date) {
  const steps = visibleSteps(scenario);
  for (let idx = 0; idx < steps.length; idx++) {
    const arrival = stepArrival(scenario, idx);
    const nights = Math.max(stepNights(steps[idx]), 1);
    if (!arrival) continue;
    const departure = dateAfter(arrival, nights);
    const iso = dateToIso(arrival);
    const departureIso = dateToIso(departure);
    if (date >= iso && date < departureIso) return steps[idx];
  }
  return null;
}

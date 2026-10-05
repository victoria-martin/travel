/*
  La carte du jour ne montre que ce que la journée concerne : l'hébergement et les activités
  planifiées ce jour-là dans le scénario choisi, plus les lieux référencés dans le texte — sans
  tracé, la route est l'affaire du scénario.
*/
function journalMapPlaces(date) {
  const scenario = getScenario(prefs.journalScenarioId);
  const planned = scenario ? journalPlannedItemsForDay(scenario, date) : [];
  const entry = getJournalEntry(currentTravelId(), date);
  const refs = journalTextRefs(entry ? entry.text : '')
    .map((r) => r.entity)
    .filter(Boolean)
    .map((e) => ({ id: e.id, kind: e.kind }));
  const byId = new Map([...planned, ...refs].map((item) => [item.id, item]));
  return Array.from(byId.values());
}

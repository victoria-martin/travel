/*
  La carte du jour ne montre que ce que la journée concerne : l'hébergement et les activités
  planifiées ce jour-là dans le scénario choisi, plus les lieux référencés dans le texte. Un canevas
  par jour affiché, comme scenarioMapBlock — mais sans tracé, la route est l'affaire du scénario.
*/
let journalMap = null;

function journalMapBlock(date) {
  return /* HTML */ `<div class="scenario-map-block">
    <div class="scenario-map-canvas" id="journal-map-canvas"></div>
  </div>`;
}

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

function initJournalMap() {
  if (journalMap) {
    journalMap.remove();
    journalMap = null;
  }
  const el = document.getElementById('journal-map-canvas');
  if (!el || typeof L === 'undefined') return;
  const date = prefs.journalDate;
  journalMap = createLeafletMap(el.id);
  const bounds = [];
  journalMapPlaces(date).forEach((item) => {
    if (item.kind === 'accommodation') {
      const acc = getAccommodation(item.id);
      if (acc) addAccommodationMarker(journalMap, acc, bounds);
    } else {
      const attraction = getAttraction(item.id);
      if (attraction) addAttractionMarker(journalMap, attraction, bounds);
    }
  });
  fitToPoints(journalMap, bounds);
}

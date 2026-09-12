/*
  UI preferences live in their own localStorage key: mergeStates in js/sync.js rebuilds `state`
  from the four data collections only, so anything stored there is dropped on the next pull.
*/

const PREFS_KEY = 'voyage-toscane-prefs';

let prefs = { hiddenColumns: {}, showScenarioMap: true, sort: {}, showButtonLabels: true };

function loadPrefs() {
  const stored = readStore(PREFS_KEY);
  if (stored) prefs = { ...prefs, ...stored };
}

function persistPrefs() {
  writeStore(PREFS_KEY, prefs);
}

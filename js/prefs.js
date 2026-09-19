/*
  UI preferences live in their own localStorage key: mergeStates in js/sync.js rebuilds `state`
  from the four data collections only, so anything stored there is dropped on the next pull.
*/

const PREFS_KEY = 'voyage-toscane-prefs';

let prefs = {
  hiddenColumns: {},
  scenarioSidePanel: 'map',
  scenarioSideWidth: { map: 50, money: 28, valise: 28 },
  recapFolds: {},
  sort: {},
  sortOrder: {},
  showButtonLabels: true,
  trailColorByType: false,
  outOfRangeStyle: 'alert',
  mobileNavOrder: null,
};

function loadPrefs() {
  const stored = readStore(PREFS_KEY);
  if (stored) prefs = { ...prefs, ...stored };
  renamePref('voitures', 'locations');
}

// Une page renommée emporte ses préférences : elles sont rangées sous la clé de sa liste.
function renamePref(from, to) {
  ['hiddenColumns', 'sort'].forEach((group) => {
    if (prefs[group][from] === undefined) return;
    prefs[group][to] = prefs[group][from];
    delete prefs[group][from];
  });
}

function persistPrefs() {
  writeStore(PREFS_KEY, prefs);
}

/*
  UI preferences live in their own localStorage key: mergeStates in js/sync.js rebuilds `state`
  from the four data collections only, so anything stored there is dropped on the next pull.
*/

// TODO: il faut utiliser l'id du projet
const PREFS_KEY = 'voyage-toscane-prefs';

var prefs = {
  hiddenColumns: {},
  scenarioSidePanel: 'map',
  scenarioSideWidth: { map: 50, money: 28, valise: 28 },
  mapSideWidth: 250,
  recapFolds: {},
  navSectionFolds: {},
  sort: {},
  sortValueOrder: {},
  showButtonLabels: false,
  trailColorByType: false,
  trailShown: false,
  trailStyle: 'trail',
  stepAreaShape: 'circle',
  weatherBannerShown: false,
  weatherBannerStyle: 'timeline',
  outOfRangeStyle: 'alert',
  phraseStyle: 'classique',
  mobileNavOrder: null,
  filters: {},
  customWords: {},
};

function loadPrefs() {
  const stored = readStore(PREFS_KEY);
  if (stored) {
    prefs = { ...prefs, ...stored };
    if (stored.sortValueOrder === undefined) prefs.sortValueOrder = stored.sortOrder || {};
    delete prefs.sortOrder;
  }
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

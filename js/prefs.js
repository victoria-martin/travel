/*
  UI preferences live in their own localStorage key: mergeStates in js/sync.js rebuilds `state`
  from the four data collections only, so anything stored there is dropped on the next pull.
*/

const PREFS_KEY = 'voyage-toscane-prefs';

let prefs = { hiddenColumns: {} };

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) prefs = { ...prefs, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Préférences illisibles', e);
  }
}

function persistPrefs() {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Erreur de sauvegarde des préférences', e);
  }
}

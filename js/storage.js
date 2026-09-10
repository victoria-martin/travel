/*
  Le Google Sheet (voir js/sync.js) est la seule source de données : rien n'est embarqué
  dans l'app. localStorage sert de cache local, pour travailler hors ligne entre deux synchros.
*/

function emptyData() {
  return { accommodations: [], cars: [], fixedCosts: [], scenarios: [] };
}

function loadData() {
  state = readLocalStorage() || emptyData();
  render();
}

function readLocalStorage() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveNow() {
  persist();
  pushNow();
}

function persist() {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Erreur de sauvegarde locale', e);
  }
}

/*
  Le Google Sheet (voir js/sync.js) est la seule source de données : rien n'est embarqué
  dans l'app. localStorage sert de cache local, pour travailler hors ligne entre deux synchros.
*/

function emptyData() {
  return { accommodations: [], cars: [], fixedCosts: [], cities: [], scenarios: [] };
}

function loadData() {
  loadPrefs();
  state = migrateData(readLocalStorage() || emptyData());
  render();
}

/*
  Before addresses, `region` was typed by hand and held province-level values ("Sienne",
  "Florence") — the same granularity the map filter now reads from `county`.
*/
function migrateData(data) {
  if (!data.cities) data.cities = [];
  (data.accommodations || []).forEach((a) => {
    if (!a.status) a.status = DEFAULT_ACCOMMODATION_STATUS;
    if (a.address === undefined) a.address = '';
    if (a.geoAddress === undefined) a.geoAddress = a.address;
    if (a.county === undefined) {
      a.county = a.region || '';
      a.region = '';
    }
  });
  data.cities.forEach((c) => {
    if (c.geoAddress === undefined) {
      c.geoAddress = c.address || '';
      delete c.address;
    }
  });
  return data;
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
  schedulePush();
}

function persist() {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Erreur de sauvegarde locale', e);
  }
}

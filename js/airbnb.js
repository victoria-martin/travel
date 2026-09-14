/*
  Coller un lien Airbnb dans la modale hébergement pré-remplit la fiche.
  La page est lue par l'Apps Script (voir apps-script/Airbnb.js) : le navigateur ne peut pas la
  lire lui-même, airbnb.fr ne renvoie pas d'en-tête CORS.
  Le prix n'en fait pas partie, Airbnb ne le sert pas dans sa page : il reste à saisir.
*/

const AIRBNB_URL = /^https?:\/\/([a-z0-9-]+\.)*airbnb\.[a-z.]{2,6}\//i;

const AIRBNB_FIELDS = [
  { key: 'name', id: 'f-name' },
  { key: 'lat', id: 'geo-lat' },
  { key: 'lng', id: 'geo-lng' },
  ...PLACE_LEVEL_KEYS.map((key) => ({ key, id: `geo-${key}` })),
];

function isAirbnbUrl(url) {
  return AIRBNB_URL.test(url);
}

// The field still holds its old value while the paste event runs.
function importAirbnbPaste() {
  setTimeout(importAirbnbLink, 0);
}

// Pasting imports right away, so leaving the field must not read the same listing twice.
async function importAirbnbLink() {
  const field = document.getElementById('f-link');
  const url = field ? field.value.trim() : '';
  if (!isAirbnbUrl(url) || field.dataset.imported === url) return;
  if (!syncActive()) {
    setGeocodeStatus('⚠️ Import Airbnb indisponible : configure la synchro du Sheet.', false);
    return;
  }
  field.dataset.imported = url;
  setGeocodeStatus("⏳ Lecture de l'annonce Airbnb…", true);
  try {
    applyAirbnb(await fetchAirbnb(url));
  } catch (e) {
    delete field.dataset.imported;
    setGeocodeStatus('⚠️ Import Airbnb impossible — ' + e.message, false);
  }
}

async function fetchAirbnb(url) {
  const res = await fetch(`${sync.url}?airbnb=${encodeURIComponent(url)}`, { redirect: 'follow' });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return parseSheetResponse(await res.text());
}

function applyAirbnb(stay) {
  document.getElementById('f-type').value = 'airbnb';
  const filled = AIRBNB_FIELDS.filter(({ key, id }) => {
    const field = document.getElementById(id);
    if (!field || !stay[key] || field.value.trim()) return false;
    field.value = stay[key];
    return true;
  });
  setGeocodeStatus(airbnbSummary(stay, filled.length), false);
}

function airbnbSummary(stay, filledCount) {
  if (!filledCount) return '🛏️ Airbnb : la fiche est déjà remplie, rien à compléter.';
  const place = placeLevelsLabel(stay);
  return `🛏️ ${[stay.name, place, 'prix à saisir'].filter(Boolean).join(' — ')}`;
}

/*
  Coller un lien HomeExchange dans la modale hébergement pré-remplit la fiche.
  La page est lue par l'Apps Script (voir apps-script/HomeExchange.js) : le navigateur ne
  peut pas la lire lui-même, homeexchange.fr ne renvoie pas d'en-tête CORS.
*/

const HOME_EXCHANGE_URL = /^https?:\/\/([a-z0-9-]+\.)*homeexchange\.(fr|com)\//i;

// Le GP/nuit se range dans `price` : c'est le type de l'hébergement qui dit la monnaie.
const HOME_EXCHANGE_FIELDS = [
  { key: 'name', id: 'f-name' },
  { key: 'gp', id: 'f-price' },
  { key: 'city', id: 'geo-city' },
  { key: 'county', id: 'geo-county' },
  { key: 'region', id: 'geo-region' },
];

function isHomeExchangeUrl(url) {
  return HOME_EXCHANGE_URL.test(url);
}

async function importHomeExchangeLink() {
  const field = document.getElementById('f-link');
  const url = field ? field.value.trim() : '';
  if (!isHomeExchangeUrl(url)) return;
  if (!syncActive()) {
    setGeocodeStatus('⚠️ Import HomeExchange indisponible : configure la synchro du Sheet.', false);
    return;
  }
  setGeocodeStatus("⏳ Lecture de l'annonce HomeExchange…", true);
  try {
    applyHomeExchange(await fetchHomeExchange(url));
  } catch (e) {
    setGeocodeStatus('⚠️ Import HomeExchange impossible — ' + e.message, false);
  }
}

async function fetchHomeExchange(url) {
  const res = await fetch(`${sync.url}?homeExchange=${encodeURIComponent(url)}`, {
    redirect: 'follow',
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return parseSheetResponse(await res.text());
}

function applyHomeExchange(home) {
  document.getElementById('f-type').value = 'homeExchange';
  const filled = HOME_EXCHANGE_FIELDS.filter(({ key, id }) => {
    const field = document.getElementById(id);
    if (!field || !home[key] || field.value.trim()) return false;
    field.value = home[key];
    return true;
  });
  setGeocodeStatus(homeExchangeSummary(home, filled.length), false);
}

function homeExchangeSummary(home, filledCount) {
  if (!filledCount) return '🔁 HomeExchange : la fiche est déjà remplie, rien à compléter.';
  const place = [home.city, home.county, home.region].filter(Boolean).join(' · ');
  return `🔁 ${[place, home.gp && `${home.gp} GP/nuit`].filter(Boolean).join(' — ')}`;
}

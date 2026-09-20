/*
  Coller un lien Google Maps dans la modale d'un lieu ou d'un hébergement pré-remplit la fiche.
  La page est lue par l'Apps Script (voir apps-script/GoogleMaps.js) : le navigateur ne peut pas
  la lire lui-même, google.com ne renvoie pas d'en-tête CORS.
  Le bloc de localisation étant partagé, seul le champ du nom change d'un écran à l'autre.
*/

const GOOGLE_MAPS_URL =
  /^https?:\/\/((maps\.app\.goo\.gl|goo\.gl)\/|([a-z0-9-]+\.)*google\.[a-z.]{2,6}\/maps)/i;

const GOOGLE_MAPS_PLACE_FIELDS = [
  { key: 'address', id: 'geo-address' },
  { key: 'lat', id: 'geo-lat' },
  { key: 'lng', id: 'geo-lng' },
];

function isGoogleMapsUrl(url) {
  return GOOGLE_MAPS_URL.test(url);
}

function googleMapsPlaceUrl(query) {
  return `https://www.google.fr/maps/place/${encodeURIComponent(query)}/`;
}

// The field still holds its old value while the paste event runs.
function importGoogleMapsPaste(field, nameId) {
  setTimeout(() => importGoogleMapsLink(field, nameId), 0);
}

// Pasting imports right away, so leaving the field must not read the same place twice.
async function importGoogleMapsLink(field, nameId) {
  const url = field ? field.value.trim() : '';
  if (!isGoogleMapsUrl(url) || field.dataset.imported === url) return;
  if (!syncActive()) {
    setGeocodeStatus('⚠️ Import Google Maps indisponible : configure la synchro du Sheet.', false);
    return;
  }
  field.dataset.imported = url;
  setGeocodeStatus('⏳ Lecture de la fiche Google Maps…', true);
  try {
    applyGoogleMapsPlace(await fetchGoogleMapsPlace(url), nameId);
  } catch (e) {
    delete field.dataset.imported;
    setGeocodeStatus('⚠️ Import Google Maps impossible — ' + e.message, false);
  }
}

async function fetchGoogleMapsPlace(url) {
  const res = await fetch(`${sync.url}?googleMaps=${encodeURIComponent(url)}`, {
    redirect: 'follow',
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return parseSheetResponse(await res.text());
}

function applyGoogleMapsPlace(place, nameId) {
  const fields = [{ key: 'name', id: nameId }, ...GOOGLE_MAPS_PLACE_FIELDS];
  const filled = fields.filter(({ key, id }) => {
    const field = document.getElementById(id);
    if (!field || !place[key] || field.value.trim()) return false;
    field.value = place[key];
    return true;
  });
  if (place.searchDate) modal.payload.searchDate = place.searchDate;
  setGeocodeStatus(googleMapsSummary(place, filled.length), false);
}

function googleMapsSummary(place, filledCount) {
  if (!filledCount) return '📍 Google Maps : la fiche est déjà remplie, rien à compléter.';
  return `📍 ${[place.name, place.address].filter(Boolean).join(' — ')}`;
}

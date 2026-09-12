/*
  Coller un lien Booking dans la modale hébergement pré-remplit la fiche.
  La page est lue par l'Apps Script (voir apps-script/Booking.js) : le navigateur ne peut pas la
  lire lui-même, booking.com ne renvoie pas d'en-tête CORS.
*/

const BOOKING_URL = /^https?:\/\/([a-z0-9-]+\.)*booking\.com\//i;

// L'adresse remplit les deux champs : celui de la fiche, et celui que « Localiser » géocode.
const BOOKING_FIELDS = [
  { key: 'name', id: 'f-name' },
  { key: 'type', id: 'f-type' },
  { key: 'price', id: 'f-price' },
  { key: 'address', id: 'f-address' },
  { key: 'address', id: 'geo-address' },
  { key: 'city', id: 'geo-city' },
  { key: 'region', id: 'geo-region' },
];

function isBookingUrl(url) {
  return BOOKING_URL.test(url);
}

// The field still holds its old value while the paste event runs.
function importBookingPaste() {
  setTimeout(importBookingLink, 0);
}

// Pasting imports right away, so leaving the field must not read the same listing twice.
async function importBookingLink() {
  const field = document.getElementById('f-booking-link');
  const url = field ? field.value.trim() : '';
  if (!isBookingUrl(url) || field.dataset.imported === url) return;
  if (!syncActive()) {
    setGeocodeStatus('⚠️ Import Booking indisponible : configure la synchro du Sheet.', false);
    return;
  }
  field.dataset.imported = url;
  setGeocodeStatus("⏳ Lecture de l'annonce Booking…", true);
  try {
    applyBooking(await fetchBooking(url));
  } catch (e) {
    delete field.dataset.imported;
    setGeocodeStatus('⚠️ Import Booking impossible — ' + e.message, false);
  }
}

async function fetchBooking(url) {
  const res = await fetch(`${sync.url}?booking=${encodeURIComponent(url)}`, { redirect: 'follow' });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return parseSheetResponse(await res.text());
}

function applyBooking(stay) {
  const filled = BOOKING_FIELDS.filter(({ key, id }) => {
    const field = document.getElementById(id);
    if (!field || !stay[key] || field.value.trim()) return false;
    field.value = stay[key];
    return true;
  });
  setGeocodeStatus(bookingSummary(stay, filled.length), false);
}

function bookingSummary(stay, filledCount) {
  if (!filledCount) return '🏨 Booking : la fiche est déjà remplie, rien à compléter.';
  const place = [stay.city, stay.region].filter(Boolean).join(' · ');
  return `🏨 ${[stay.name, place, stay.price && `${stay.price} €`].filter(Boolean).join(' — ')}`;
}

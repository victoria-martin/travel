/*
  Single localStorage gateway: JSON encoding and quota failures are handled here, so the
  four keys (data, prefs, sync url, sync base) can never drift apart on error handling.
  A failed read degrades to a default; a failed write loses data, so it always shouts.
*/

function readStore(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function readStoreString(key) {
  try {
    return localStorage.getItem(key) || '';
  } catch (e) {
    return '';
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Erreur de sauvegarde locale (${key})`, e);
  }
}

function writeStoreString(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error(`Erreur de sauvegarde locale (${key})`, e);
  }
}

function removeStore(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`Erreur de suppression locale (${key})`, e);
  }
}

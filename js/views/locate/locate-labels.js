/* Read-only labels for anything located through locateFields: accommodations and places. */

function coordsLabel(p) {
  if (!p.lat || !p.lng) return '—';
  return `${parseFloat(p.lat).toFixed(4)}, ${parseFloat(p.lng).toFixed(4)}`;
}

// Du plus fin au plus large : on lit d'abord où l'on est, le pays se devine.
function placeLevelsLabel(p) {
  return PLACE_LEVELS.map((level) => p[level.key])
    .filter(Boolean)
    .reverse()
    .join(' · ');
}

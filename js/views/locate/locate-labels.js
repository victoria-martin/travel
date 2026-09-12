/* Read-only labels for anything located through locateFields: cities, attractions. */

function coordsLabel(p) {
  if (!p.lat || !p.lng) return '—';
  return `${parseFloat(p.lat).toFixed(4)}, ${parseFloat(p.lng).toFixed(4)}`;
}

function placeLabel(p) {
  return p.geoAddress || [p.county, p.region].filter(Boolean).join(' · ') || '—';
}

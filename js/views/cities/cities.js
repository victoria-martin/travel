function renderCitiesView() {
  const items = [...state.cities].sort((a, b) => a.name.localeCompare(b.name));
  return /* HTML */ `
    ${citiesHeader(items)}
    ${items.length === 0 ? emptyState('Aucune ville', 'Ajoute une première ville à visiter.') : citiesTable(items)}
  `;
}

function cityCoordsLabel(c) {
  if (!c.lat || !c.lng) return '—';
  return `${parseFloat(c.lat).toFixed(4)}, ${parseFloat(c.lng).toFixed(4)}`;
}

function cityPlaceLabel(c) {
  return c.geoAddress || [c.county, c.region].filter(Boolean).join(' · ') || '—';
}

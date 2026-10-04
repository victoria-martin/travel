function selectTravel(id) {
  openTravel(id);
  render();
}

function openTravelModal(id) {
  openModal('voyage', id || undefined);
}

// Under the name: the dates when they are filled in, the destination otherwise.
function travelSubtitle(travel) {
  if (!travel) return 'Crée ton premier voyage';
  const parts = [travelDateRange(travel), travel.region || (travel.countries || []).map(countryLabel).join(', ')];
  return parts.filter(Boolean).join(' · ') || 'Carnet de préparation';
}

function travelDateRange(travel) {
  const start = monthLabel(travel.startDate);
  const end = monthLabel(travel.endDate);
  if (start && end && start !== end) return `${start} → ${end}`;
  return start || end || '';
}

function monthLabel(iso) {
  const date = isoToDate(iso);
  return date ? date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '';
}

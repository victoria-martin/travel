COLUMN_SETS.prestataires = [
  { key: 'logo', label: '', locked: true, cell: providerLogo },
  {
    key: 'name',
    label: 'Nom',
    locked: true,
    cell: providerNameCell,
    sortValue: (p) => (p.name || '').toLowerCase(),
  },
  {
    key: 'mode',
    label: 'Mode',
    cell: providerModeTag,
    sortValue: (p) => providerModeKey(p.mode),
    sortOrder: { key: 'transportMode', dict: PROVIDER_MODES, label: 'Ordre des modes' },
  },
  { key: 'options', label: 'Options', cell: providerOptionsCell },
  { key: 'models', label: 'Modèles', cell: providerModelsCell },
  { key: 'site', label: 'Site', cell: providerSiteCell },
  { key: 'booking', label: 'Réservation', cell: providerBookingCell },
  { key: 'notes', label: 'Notes', hiddenByDefault: true, cell: providerNotesCell },
  { key: 'actions', label: '', locked: true, nowrap: true, cell: providerActionsCell },
];

SORT_DEFAULTS.prestataires = [
  { key: 'mode', dir: 'asc' },
  { key: 'name', dir: 'asc' },
];

function providerNameCell(p) {
  return textCell(p.name);
}

// Seule la voiture a des modèles : les autres modes n'ont rien à montrer ici.
function providerModelsCell(p) {
  const models = providerCarModels(p.id);
  if (!models.length) return '—';
  return models.map((model) => `<span class="tag-chip">${escapeHtml(model.name)}</span>`).join('');
}

function providerSiteCell(p) {
  return p.site ? externalLink(p.site, 'Voir') : '—';
}

function providerBookingCell(p) {
  return p.bookingUrl ? externalLink(p.bookingUrl, 'Réserver') : '—';
}

function providerNotesCell(p) {
  return textCell(p.notes);
}

function providerActionsCell(p) {
  return `${editButton('prestataire', p.id)}${deleteButton('providers', p.id)}`;
}

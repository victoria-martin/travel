COLUMN_SETS.attractions = [
  {
    key: 'favorite',
    label: '',
    pickerLabel: '⭐ Favori',
    locked: true,
    cell: attractionFavoriteCell,
    sortValue: (a) => (a.favorite ? 0 : 1),
    sortLabels: { asc: "Favoris d'abord ⭐", desc: 'Favoris en dernier' },
  },
  {
    key: 'name',
    label: 'Nom',
    locked: true,
    cell: attractionNameCell,
    sortValue: (a) => (a.name || '').toLowerCase(),
  },
  {
    key: 'type',
    label: 'Type',
    cell: attractionTypeCell,
    sortValue: (a) => dictSortIndex(ATTRACTION_TYPES, attractionTypeKey(a.type)),
  },
  {
    key: 'status',
    label: 'Statut',
    cell: attractionStatusCell,
    sortValue: (a) => dictSortIndex(ATTRACTION_STATUSES, attractionStatusKey(a.status)),
  },
  { key: 'tags', label: 'Tags', cell: attractionTagsCell },
  {
    key: 'description',
    label: 'Description',
    cell: attractionDescriptionCell,
  },
  {
    key: 'place',
    label: 'Adresse à localiser / zone',
    cell: attractionPlaceCell,
    sortValue: (a) => placeLabel(a).toLowerCase(),
  },
  {
    key: 'coords',
    label: 'Coordonnées',
    nowrap: true,
    hiddenByDefault: true,
    cell: attractionCoordsCell,
  },
  { key: 'link', label: 'Lien', cell: linkCell },
  { key: 'actions', label: '', locked: true, nowrap: true, cell: attractionActionsCell },
];

SORT_DEFAULTS.attractions = [
  { key: 'favorite', dir: 'asc' },
  { key: 'type', dir: 'asc' },
  { key: 'name', dir: 'asc' },
];

function attractionFavoriteCell(a) {
  return favoriteStar(a.favorite, `toggleAttractionFavorite('${a.id}')`);
}

function attractionNameCell(a) {
  return `<strong>${escapeHtml(a.name)}</strong>`;
}

function attractionTypeCell(a) {
  return attractionTypeDropdown(a);
}

function attractionStatusCell(a) {
  return attractionStatusTag(a);
}

function attractionTagsCell(a) {
  return tagChips(a.tags) || '—';
}

function attractionDescriptionCell(a) {
  return textCell(a.description);
}

function attractionPlaceCell(a) {
  return escapeHtml(placeLabel(a));
}

function attractionCoordsCell(a) {
  return escapeHtml(coordsLabel(a));
}

function attractionActionsCell(a) {
  const duplicate = duplicateButton(`duplicateAttraction('${a.id}')`);
  return `${editButton('attraction', a.id)}${duplicate}${deleteButton('attractions', a.id)}`;
}

COLUMN_SETS.villes = [
  {
    key: 'name',
    label: 'Ville',
    locked: true,
    cell: cityNameCell,
    sortValue: (c) => (c.name || '').toLowerCase(),
  },
  {
    key: 'place',
    label: 'Adresse à localiser / zone',
    cell: cityPlaceCell,
    sortValue: (c) => placeLabel(c).toLowerCase(),
  },
  { key: 'coords', label: 'Coordonnées', nowrap: true, cell: cityCoordsCell },
  { key: 'notes', label: 'Notes', cell: cityNotesCell },
  { key: 'actions', label: '', locked: true, nowrap: true, cell: cityActionsCell },
];

SORT_DEFAULTS.villes = [{ key: 'name', dir: 'asc' }];

function cityNameCell(c) {
  return `<strong>${escapeHtml(c.name)}</strong>`;
}

function cityPlaceCell(c) {
  return escapeHtml(placeLabel(c));
}

function cityCoordsCell(c) {
  return escapeHtml(coordsLabel(c));
}

function cityNotesCell(c) {
  return textCell(c.notes);
}

function cityActionsCell(c) {
  const duplicate = duplicateButton(`duplicateCity('${c.id}')`);
  return `${editButton('ville', c.id)}${duplicate}${deleteButton('cities', c.id)}`;
}

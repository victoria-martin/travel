COLUMN_SETS.transports = [
  {
    key: 'favorite',
    label: '',
    pickerLabel: '⭐ Favori',
    locked: true,
    cell: transportFavoriteCell,
    sortValue: (t) => (t.favorite ? 0 : 1),
    sortLabels: { asc: "Favoris d'abord ⭐", desc: 'Favoris en dernier' },
  },
  {
    key: 'mode',
    label: 'Mode',
    locked: true,
    cell: transportModeCell,
    sortValue: (t) => dictSortIndex(TRANSPORT_MODES, transportModeKey(t.mode)),
  },
  {
    key: 'from',
    label: 'Départ',
    cell: transportFromCell,
    sortValue: (t) => transportEndpointLabel(t.fromCityId, t.fromPrecision).toLowerCase(),
  },
  {
    key: 'to',
    label: 'Arrivée',
    cell: transportToCell,
    sortValue: (t) => transportEndpointLabel(t.toCityId, t.toPrecision).toLowerCase(),
  },
  {
    key: 'departure',
    label: 'Part le',
    nowrap: true,
    cell: transportDepartureCell,
    sortValue: (t) => transportMoment(t.departDate, t.departTime),
  },
  {
    key: 'arrival',
    label: 'Arrive le',
    nowrap: true,
    hiddenByDefault: true,
    cell: transportArrivalCell,
    sortValue: (t) => transportMoment(t.arriveDate, t.arriveTime),
  },
  { key: 'carrier', label: 'Compagnie / loueur', cell: transportCarrierCell },
  {
    key: 'price',
    label: 'Prix',
    nowrap: true,
    cell: transportPriceCell,
    sortValue: (t) => priceNumber(t.amountMin || t.amountMax || t.budget),
  },
  {
    key: 'status',
    label: 'Statut',
    cell: transportStatusCell,
    sortValue: (t) => dictSortIndex(TRANSPORT_STATUSES, transportStatusKey(t.status)),
  },
  { key: 'link', label: 'Lien', cell: linkCell },
  { key: 'notes', label: 'Notes', hiddenByDefault: true, cell: transportNotesCell },
  { key: 'actions', label: '', locked: true, nowrap: true, cell: transportActionsCell },
];

SORT_DEFAULTS.transports = [
  { key: 'departure', dir: 'asc' },
  { key: 'mode', dir: 'asc' },
];

function transportFavoriteCell(t) {
  return favoriteStar(t.favorite, `toggleTransportFavorite('${t.id}')`);
}

function transportModeCell(t) {
  return transportModeDropdown(t);
}

function transportFromCell(t) {
  return transportEndpointCell(t.fromCityId, t.fromPrecision);
}

function transportToCell(t) {
  return transportEndpointCell(t.toCityId, t.toPrecision);
}

function transportDepartureCell(t) {
  return transportScheduleCell(t.departDate, t.departTime);
}

function transportArrivalCell(t) {
  return transportScheduleCell(t.arriveDate, t.arriveTime);
}

function transportPriceCell(t) {
  return priceLabel(t);
}

function transportStatusCell(t) {
  return transportStatusTag(t);
}

function transportNotesCell(t) {
  return textCell(t.notes);
}

function transportActionsCell(t) {
  const duplicate = duplicateButton(`duplicateTransport('${t.id}')`);
  return `${editButton('transport', t.id)}${duplicate}${deleteButton('transports', t.id)}`;
}

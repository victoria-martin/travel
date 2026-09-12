function accSortIndex(dict, key) {
  const keys = Object.keys(dict);
  return keys.includes(key) ? keys.indexOf(key) : keys.length;
}

const ACCOMMODATION_COLUMNS = [
  {
    key: 'favorite',
    label: '',
    pickerLabel: '⭐ Favori',
    locked: true,
    cell: accommodationFavoriteCell,
    sortValue: (a) => (a.favorite ? 0 : 1),
    sortLabels: { asc: "Favoris d'abord ⭐", desc: 'Favoris en dernier' },
  },
  { key: 'name', label: 'Nom', locked: true, cell: accommodationNameCell },
  {
    key: 'type',
    label: 'Type',
    cell: accommodationTypeCell,
    sortValue: (a) => accSortIndex(ACCOMMODATION_TYPES, accTypeKey(a.type)),
  },
  {
    key: 'status',
    label: 'Statut',
    cell: accommodationStatusCell,
    sortValue: (a) => accSortIndex(ACCOMMODATION_STATUSES, accStatusKey(a.status)),
  },
  {
    key: 'city',
    label: 'Ville',
    cell: accommodationCityCell,
    sortValue: (a) => (a.city || '').toLowerCase(),
  },
  { key: 'county', label: 'Province', cell: accommodationCountyCell },
  { key: 'region', label: 'Région', hiddenByDefault: true, cell: accommodationRegionCell },
  { key: 'tags', label: 'Tags', cell: tagsCell },
  { key: 'address', label: 'Adresse', hiddenByDefault: true, cell: accommodationAddressCell },
  { key: 'price', label: 'Prix', nowrap: true, cell: accommodationPriceCell },
  { key: 'dates', label: 'Dates', cell: accommodationDatesCell },
  { key: 'notes', label: 'Notes', hiddenByDefault: true, cell: accommodationNotesCell },
  { key: 'link', label: 'Lien', cell: linkCell },
  { key: 'bookingLink', label: 'Booking', cell: accommodationBookingLinkCell },
  { key: 'actions', label: '', locked: true, nowrap: true, cell: accommodationActionsCell },
];

COLUMN_SETS.hebergements = ACCOMMODATION_COLUMNS;

SORT_DEFAULTS.hebergements = [
  { key: 'favorite', dir: 'asc' },
  { key: 'type', dir: 'asc' },
  { key: 'status', dir: 'asc' },
];

function accommodationFavoriteCell(a) {
  return favoriteStar(a.favorite, `toggleFavorite('${a.id}')`);
}

function accommodationNameCell(a) {
  const notes = `<div class="row-notes">${notesEditable(a)}</div>`;
  return `<strong>${escapeHtml(a.name)}</strong>${notes}`;
}

function accommodationTypeCell(a) {
  return accommodationTypeDropdown(a);
}

function accommodationStatusCell(a) {
  return accommodationStatusTag(a);
}

function accommodationCityCell(a) {
  return textCell(a.city);
}

function accommodationCountyCell(a) {
  return textCell(a.county);
}

function accommodationRegionCell(a) {
  return textCell(a.region);
}

function accommodationAddressCell(a) {
  return textCell(a.address);
}

function accommodationPriceCell(a) {
  return priceEditable(a);
}

function accommodationDatesCell(a) {
  return textCell(a.dates);
}

function accommodationNotesCell(a) {
  return notesEditable(a);
}

function accommodationBookingLinkCell(a) {
  if (!a.bookingLink) return '—';
  return `<a href="${escapeHtml(a.bookingLink)}" target="_blank" style="color:var(--stone-dark);">Booking</a>`;
}

function accommodationActionsCell(a) {
  const duplicate = duplicateButton(`duplicateAccommodation('${a.id}')`);
  return `${editButton('accommodation', a.id)}${duplicate}${deleteButton('accommodations', a.id)}`;
}

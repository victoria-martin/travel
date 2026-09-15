/*
  La page Voitures écrit ses lignes en clair, sous la location qui les tient : ces colonnes sont
  celles des listes filtrées de la page À faire, qui lisent la collection entière. D'où la colonne
  location, que la page Voitures n'aurait pas à répéter sur chaque ligne.
*/
COLUMN_SETS.locations = [
  { key: 'default', label: '', locked: true, cell: defaultOfferCell },
  {
    key: 'model',
    label: 'Modèle',
    locked: true,
    cell: offerModelCell,
    sortValue: (c) => offerModelName(c).toLowerCase(),
  },
  {
    key: 'rental',
    label: 'Location',
    cell: offerRentalCell,
    sortValue: (c) => rentalLabel(offerRental(c)).toLowerCase(),
  },
  {
    key: 'fuel',
    label: 'Motorisation',
    cell: offerFuelCell,
    sortValue: (c) => carFuelKey(offerWords(c).fuel),
    sortOrder: { key: 'carFuel', dict: CAR_FUELS, label: 'Ordre des motorisations' },
  },
  {
    key: 'gearbox',
    label: 'Boîte',
    cell: offerGearboxCell,
    sortValue: (c) => carGearboxKey(offerWords(c).gearbox),
    sortOrder: { key: 'carGearbox', dict: CAR_GEARBOXES, label: 'Ordre des boîtes' },
  },
  {
    key: 'status',
    label: 'Statut',
    cell: offerStatusCell,
    sortValue: (c) => carStatusKey(c.status),
    sortOrder: { key: 'carStatus', dict: CAR_STATUSES, label: 'Ordre des statuts' },
  },
  {
    key: 'price',
    label: 'Prix',
    nowrap: true,
    cell: offerPriceCell,
    sortValue: (c) => offerTotal(c),
  },
  { key: 'options', label: 'Options', cell: offerOptionsCell },
  { key: 'link', label: 'Lien', cell: linkCell },
  { key: 'actions', label: '', locked: true, nowrap: true, cell: offerActionsCell },
];

SORT_DEFAULTS.locations = [
  { key: 'rental', dir: 'asc' },
  { key: 'model', dir: 'asc' },
];

function offerModelCell(c) {
  return `${textCell(offerModelName(c))}<div class="row-notes">${offerNotesEditable(c)}</div>`;
}

function offerRentalCell(c) {
  const rental = offerRental(c);
  const dates = rentalDatesLabel(rental).join(' · ');
  return `${escapeHtml(rentalLabel(rental))}${dates ? `<div class="row-notes">${escapeHtml(dates)}</div>` : ''}`;
}

function offerFuelCell(c) {
  return offerFuelTag(c);
}

function offerGearboxCell(c) {
  return offerGearboxTag(c);
}

function offerStatusCell(c) {
  return offerStatusTag(c);
}

function offerPriceCell(c) {
  return offerPriceLabels(c).join('<br/>');
}

function offerOptionsCell(c) {
  const options = offerOptions(c);
  if (!options.length) return '—';
  return options
    .map((option) => `<div class="provider-option">${escapeHtml(option.label)}</div>`)
    .join('');
}

function offerActionsCell(c) {
  const duplicate = duplicateButton(`duplicateOffer('${c.id}')`);
  return `${editButton('voiture', c.id)}${duplicate}${deleteButton('offers', c.id)}`;
}

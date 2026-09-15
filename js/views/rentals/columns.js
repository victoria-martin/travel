/*
  La page Voitures écrit ses lignes en clair, sous la location qui les tient : ces colonnes sont
  celles des listes filtrées de la page À faire, qui lisent la collection entière. D'où la colonne
  location, que la page Voitures n'aurait pas à répéter sur chaque ligne.
*/
COLUMN_SETS.locations = [
  { key: 'default', label: '', locked: true, cell: defaultCarCell },
  {
    key: 'model',
    label: 'Modèle',
    locked: true,
    cell: carModelCell,
    sortValue: (c) => vehicleModelName(c).toLowerCase(),
  },
  {
    key: 'rental',
    label: 'Location',
    cell: carRentalCell,
    sortValue: (c) => rentalLabel(vehicleRental(c)).toLowerCase(),
  },
  {
    key: 'fuel',
    label: 'Motorisation',
    cell: carFuelCell,
    sortValue: (c) => carFuelKey(vehicleWords(c).fuel),
    sortOrder: { key: 'carFuel', dict: CAR_FUELS, label: 'Ordre des motorisations' },
  },
  {
    key: 'gearbox',
    label: 'Boîte',
    cell: carGearboxCell,
    sortValue: (c) => carGearboxKey(vehicleWords(c).gearbox),
    sortOrder: { key: 'carGearbox', dict: CAR_GEARBOXES, label: 'Ordre des boîtes' },
  },
  {
    key: 'status',
    label: 'Statut',
    cell: carStatusCell,
    sortValue: (c) => carStatusKey(c.status),
    sortOrder: { key: 'carStatus', dict: CAR_STATUSES, label: 'Ordre des statuts' },
  },
  {
    key: 'price',
    label: 'Prix',
    nowrap: true,
    cell: carPriceCell,
    sortValue: (c) => vehicleTotal(c),
  },
  { key: 'options', label: 'Options', cell: carOptionsCell },
  { key: 'link', label: 'Lien', cell: linkCell },
  { key: 'actions', label: '', locked: true, nowrap: true, cell: carActionsCell },
];

SORT_DEFAULTS.locations = [
  { key: 'rental', dir: 'asc' },
  { key: 'model', dir: 'asc' },
];

function carModelCell(c) {
  return `${textCell(vehicleModelName(c))}<div class="row-notes">${carNotesEditable(c)}</div>`;
}

function carRentalCell(c) {
  const rental = vehicleRental(c);
  const dates = rentalDatesLabel(rental).join(' · ');
  return `${escapeHtml(rentalLabel(rental))}${dates ? `<div class="row-notes">${escapeHtml(dates)}</div>` : ''}`;
}

function carFuelCell(c) {
  return vehicleFuelTag(c);
}

function carGearboxCell(c) {
  return vehicleGearboxTag(c);
}

function carStatusCell(c) {
  return carStatusTag(c);
}

function carPriceCell(c) {
  return carPriceLabels(c).join('<br/>');
}

function carOptionsCell(c) {
  const options = vehicleOptions(c);
  if (!options.length) return '—';
  return options
    .map((option) => `<div class="provider-option">${escapeHtml(option.label)}</div>`)
    .join('');
}

function carActionsCell(c) {
  const duplicate = duplicateButton(`duplicateCar('${c.id}')`);
  return `${editButton('voiture', c.id)}${duplicate}${deleteButton('cars', c.id)}`;
}

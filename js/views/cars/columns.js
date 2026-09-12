COLUMN_SETS.voitures = [
  { key: 'default', label: '', locked: true, cell: defaultCarCell },
  {
    key: 'name',
    label: 'Loueur',
    locked: true,
    cell: carNameCell,
    sortValue: (c) => (c.name || '').toLowerCase(),
  },
  {
    key: 'model',
    label: 'Modèle',
    cell: carModelCell,
    sortValue: (c) => (c.model || '').toLowerCase(),
  },
  {
    key: 'pricePerDay',
    label: 'Prix / jour',
    nowrap: true,
    cell: carPricePerDayCell,
    sortValue: (c) => priceNumber(c.pricePerDay),
  },
  {
    key: 'priceTotal',
    label: 'Prix total',
    nowrap: true,
    cell: carPriceTotalCell,
    sortValue: (c) => priceNumber(c.priceTotal),
  },
  {
    key: 'dates',
    label: 'Dates',
    cell: carDatesCell,
    sortValue: (c) => (c.dates || '').toLowerCase(),
  },
  {
    key: 'location',
    label: 'Lieu de prise en charge',
    cell: carLocationCell,
    sortValue: (c) => (c.location || '').toLowerCase(),
  },
  { key: 'link', label: 'Lien', cell: linkCell },
  { key: 'actions', label: '', locked: true, nowrap: true, cell: carActionsCell },
];

function carNameCell(c) {
  return `${textCell(c.name)}<div class="row-notes">${carNotesEditable(c)}</div>`;
}

function carModelCell(c) {
  return textCell(c.model);
}

function carPricePerDayCell(c) {
  return textCell(carPriceLabel(c.pricePerDay, '/ jour'));
}

function carPriceTotalCell(c) {
  return textCell(carPriceLabel(c.priceTotal));
}

function carDatesCell(c) {
  return textCell(c.dates);
}

function carLocationCell(c) {
  return textCell(c.location);
}

function carActionsCell(c) {
  const duplicate = duplicateButton(`duplicateCar('${c.id}')`);
  return `${editButton('voiture', c.id)}${duplicate}${deleteButton('cars', c.id)}`;
}

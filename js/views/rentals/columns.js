/*
  Les colonnes d'une offre, lues par la liste de l'onglet Voitures et par les listes filtrées de la
  page À faire. Le tri par défaut range les offres d'un même modèle ensemble, du moins cher au plus
  cher par jour : c'est la lecture qu'on vient chercher, les autres sont un clic d'en-tête.
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
    key: 'provider',
    label: 'Loueur',
    cell: offerProviderCell,
    sortValue: (c) => providerName(c.providerId).toLowerCase(),
  },
  {
    key: 'place',
    label: 'Lieu',
    cell: offerPlaceCell,
    sortValue: (c) => (c.location || '').toLowerCase(),
  },
  {
    key: 'dates',
    label: 'Dates',
    nowrap: true,
    cell: offerDatesCell,
    sortValue: (c) => c.pickupDate || '9999',
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
    sortValue: (c) => offerDayPrice(c),
  },
  { key: 'options', label: 'Options', cell: offerOptionsCell },
  { key: 'link', label: 'Lien', cell: linkCell },
  { key: 'actions', label: '', locked: true, nowrap: true, cell: offerActionsCell },
];

SORT_DEFAULTS.locations = [
  { key: 'model', dir: 'asc' },
  { key: 'price', dir: 'asc' },
];

function offerModelCell(c) {
  return `${textCell(offerModelName(c))}<div class="row-notes">${offerNotesEditable(c)}</div>`;
}

function offerProviderCell(c) {
  return escapeHtml(providerName(c.providerId)) || '—';
}

function offerPlaceCell(c) {
  return escapeHtml(c.location || '') || '—';
}

function offerDatesCell(c) {
  return escapeHtml(offerDatesLabel(c).join(' · ')) || '—';
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
  return offerDayPriceLabel(c);
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

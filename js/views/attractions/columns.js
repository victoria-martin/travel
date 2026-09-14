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
    sortValue: (a) => attractionTypeKey(a.type),
    sortOrder: { key: 'attractionType', dict: ATTRACTION_TYPES, label: 'Ordre des types' },
  },
  {
    key: 'status',
    label: 'Statut',
    cell: attractionStatusCell,
    sortValue: (a) => attractionStatusKey(a.status),
    sortOrder: {
      key: 'attractionStatus',
      dict: ATTRACTION_STATUSES,
      label: 'Ordre des statuts',
    },
  },
  {
    key: 'price',
    label: 'Prix',
    nowrap: true,
    cell: attractionPriceCell,
    sortValue: (a) => priceNumber(a.amountMin || a.amountMax || a.budget),
  },
  {
    key: 'tags',
    label: 'Tags',
    cell: (a) =>
      tagsCell(a, {
        field: 'tags',
        getItem: getAttraction,
        vocabulary: allAttractionTags,
        addLabel: '+ tag',
      }),
  },
  {
    key: 'description',
    label: 'Description',
    cell: attractionDescriptionCell,
  },
  {
    key: 'place',
    label: 'Adresse',
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
  {
    key: 'accommodation',
    label: 'Hébergement',
    hiddenByDefault: true,
    cell: attractionAccommodationCell,
    sortValue: (a) => attractionAccommodationName(a).toLowerCase(),
  },
  { key: 'hours', label: 'Horaires', hiddenByDefault: true, cell: attractionHoursCell },
  {
    key: 'phone',
    label: 'Téléphone',
    nowrap: true,
    hiddenByDefault: true,
    cell: attractionPhoneCell,
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

function attractionPriceCell(a) {
  return priceLabel(a);
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

function attractionAccommodationName(a) {
  const accommodation = getAccommodation(a.accommodationId);
  return accommodation ? accommodation.name : '';
}

function attractionAccommodationCell(a) {
  return textCell(attractionAccommodationName(a));
}

function attractionHoursCell(a) {
  return textCell(a.hours);
}

function attractionPhoneCell(a) {
  return textCell(a.phone);
}

function attractionActionsCell(a) {
  const duplicate = duplicateButton(`duplicateAttraction('${a.id}')`);
  return `${editButton('attraction', a.id)}${duplicate}${deleteButton('attractions', a.id)}`;
}

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
    key: 'recent',
    label: 'Ajout récent',
    hiddenByDefault: true,
    sortValue: (a) => a.recentOrder,
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
    filterValues: (a) => a.tags || [],
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
    ellipsis: true,
    cell: attractionDescriptionCell,
  },
  {
    key: 'city',
    label: 'Ville',
    cell: attractionCityCell,
    filterValues: (a) => [a.city],
    sortValue: (a) => (a.city || '').toLowerCase(),
  },
  {
    key: 'county',
    label: 'Province',
    cell: attractionCountyCell,
    filterValues: (a) => [a.county],
    sortValue: (a) => (a.county || '').toLowerCase(),
  },
  {
    key: 'region',
    label: 'Région',
    hiddenByDefault: true,
    cell: attractionRegionCell,
    filterValues: (a) => [a.region],
    sortValue: (a) => (a.region || '').toLowerCase(),
  },
  {
    key: 'country',
    label: 'Pays',
    hiddenByDefault: true,
    cell: attractionCountryCell,
    filterValues: (a) => [a.country],
    sortValue: (a) => (a.country || '').toLowerCase(),
  },
  {
    key: 'address',
    label: 'Adresse',
    hiddenByDefault: true,
    cell: attractionAddressCell,
    sortValue: (a) => (a.address || '').toLowerCase(),
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
  { key: 'recent', dir: 'desc' },
];

function attractionFavoriteCell(a) {
  return favoriteStar(a.favorite, `toggleAttractionFavorite('${a.id}')`);
}

function attractionNameCell(a) {
  return `<strong>${escapeHtml(a.name)}</strong>${missingAddressIndicator(a)}`;
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

function attractionCityCell(a) {
  return textCell(a.city);
}

function attractionCountyCell(a) {
  return textCell(a.county);
}

function attractionRegionCell(a) {
  return textCell(a.region);
}

function attractionCountryCell(a) {
  return textCell(a.country);
}

function attractionAddressCell(a) {
  return textCell(a.address);
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

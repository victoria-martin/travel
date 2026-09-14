/*
  Quatre axes sur la même liste : OU dans un axe, ET entre axes. Un axe ne propose que les valeurs
  qu'un hébergement du voyage porte vraiment — un statut que personne n'a ne filtrerait rien.
*/
let listFilters = { favOnly: false, types: [], statuses: [], cities: [], tags: [] };

function usedAccommodationValues(pick) {
  return new Set(ofCurrentTravel(state.accommodations).map(pick));
}

function usedAccommodationTypes() {
  const used = usedAccommodationValues((a) => accTypeKey(a.type));
  return [...Object.keys(ACCOMMODATION_TYPES), ''].filter((key) => used.has(key));
}

function usedAccommodationStatuses() {
  const used = usedAccommodationValues((a) => accStatusKey(a.status));
  return [...Object.keys(ACCOMMODATION_STATUSES), ''].filter((key) => used.has(key));
}

function usedAccommodationCities() {
  const used = usedAccommodationValues((a) => a.city || '');
  used.delete('');
  return Array.from(used).sort((a, b) => a.localeCompare(b, 'fr'));
}

// A value checked then removed from its last accommodation would filter on nothing visible.
function pruneListFilters() {
  const keep = (axis, values) => {
    listFilters[axis] = listFilters[axis].filter((value) => values.includes(value));
  };
  keep('types', usedAccommodationTypes());
  keep('statuses', usedAccommodationStatuses());
  keep('cities', usedAccommodationCities());
  keep('tags', allAccommodationTags());
}

function activeListFilterCount() {
  return (
    listFilters.types.length +
    listFilters.statuses.length +
    listFilters.cities.length +
    listFilters.tags.length +
    (listFilters.favOnly ? 1 : 0)
  );
}

function keptByListFilters(a) {
  const { types, statuses, cities, tags } = listFilters;
  if (listFilters.favOnly && !a.favorite) return false;
  if (types.length && !types.includes(accTypeKey(a.type))) return false;
  if (statuses.length && !statuses.includes(accStatusKey(a.status))) return false;
  if (cities.length && !cities.includes(a.city)) return false;
  if (tags.length && !(a.tags || []).some((tag) => tags.includes(tag))) return false;
  return true;
}

function toggleListFilter(axis, value) {
  const active = listFilters[axis];
  listFilters[axis] = active.includes(value)
    ? active.filter((v) => v !== value)
    : [...active, value];
  render();
}

function toggleTypeFilter(key) {
  toggleListFilter('types', key);
}

function toggleStatusFilter(key) {
  toggleListFilter('statuses', key);
}

// A city and a tag are free text: they travel by index rather than inside an onclick string.
function toggleCityFilter(index) {
  toggleListFilter('cities', usedAccommodationCities()[index]);
}

function toggleTagFilter(index) {
  toggleListFilter('tags', allAccommodationTags()[index]);
}

function toggleFavOnly() {
  listFilters.favOnly = !listFilters.favOnly;
  render();
}

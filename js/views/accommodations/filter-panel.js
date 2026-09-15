/*
  Un axe est une rangée des pastilles qu'on lit déjà dans la liste : on filtre en cliquant ce qu'on
  voit. Un axe qui n'a qu'une valeur ne trie rien, il ne s'affiche pas.
*/

function accommodationFilterBlocks() {
  return [typeFilterBlock(), statusFilterBlock(), cityFilterBlock(), tagFilterBlock()];
}

function typeFilterBlock() {
  const keys = usedAccommodationTypes();
  if (keys.length < 2) return null;
  return {
    count: listFilters.types.length,
    html: filterPillBlock(
      'Type',
      keys.map((key) => ({
        label: tagLabel(accType(key).emoji, accType(key).label),
        active: listFilters.types.includes(key),
        onclick: `toggleTypeFilter('${key}')`,
      })),
    ),
  };
}

function statusFilterBlock() {
  const keys = usedAccommodationStatuses();
  if (keys.length < 2) return null;
  return {
    count: listFilters.statuses.length,
    html: filterPillBlock(
      'Statut',
      keys.map((key) => ({
        label: tagLabel(accStatus(key).emoji, accStatus(key).label),
        active: listFilters.statuses.includes(key),
        onclick: `toggleStatusFilter('${key}')`,
      })),
    ),
  };
}

function cityFilterBlock() {
  const cities = usedAccommodationCities();
  if (cities.length < 2) return null;
  return {
    count: listFilters.cities.length,
    html: filterPillBlock(
      'Ville',
      cities.map((city, i) => ({
        label: escapeHtml(city),
        active: listFilters.cities.includes(city),
        onclick: `toggleCityFilter(${i})`,
        search: city,
      })),
      cities.length > 8 ? 'Chercher une ville…' : '',
    ),
  };
}

function tagFilterBlock() {
  const tags = allAccommodationTags();
  if (!tags.length) return null;
  return {
    count: listFilters.tags.length,
    html: filterPillBlock(
      'Tags',
      tags.map((tag, i) => ({
        label: escapeHtml(tag),
        active: listFilters.tags.includes(tag),
        onclick: `toggleTagFilter(${i})`,
      })),
    ),
  };
}

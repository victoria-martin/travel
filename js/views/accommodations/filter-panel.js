/*
  Un axe est une rangée des pastilles qu'on lit déjà dans la liste : on filtre en cliquant ce qu'on
  voit. Un axe qui n'a qu'une valeur ne trie rien, il ne s'affiche pas.
*/
// The search narrows a long list without a render: a render would take the focus out of the field.
let cityFilterSearch = '';

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

function filterPillBlock(title, options, searchPlaceholder) {
  const search = searchPlaceholder
    ? /* HTML */ `<input
        class="filter-search"
        type="search"
        placeholder="${searchPlaceholder}"
        value="${escapeHtml(cityFilterSearch)}"
        oninput="searchFilterPills(this)"
      />`
    : '';
  return /* HTML */ `<div class="filter-block">
    <p class="filter-title">${title}</p>
    ${search}
    <div class="filter-pills">${options.map(filterPill).join('')}</div>
  </div>`;
}

// An active pill stays visible whatever the search: a filter that applies has to be readable.
function filterPill({ label, active, onclick, search }) {
  const hidden =
    search && !active && !matchesFilterSearch(search, cityFilterSearch) ? 'hidden' : '';
  return /* HTML */ `<button
    class="filter-pill ${active ? 'active' : ''}"
    ${search ? `data-search="${escapeHtml(search)}"` : ''}
    ${hidden}
    onclick="${onclick}"
  >
    ${label}
  </button>`;
}

function searchFilterPills(input) {
  cityFilterSearch = input.value;
  input.parentElement.querySelectorAll('.filter-pill[data-search]').forEach((pill) => {
    pill.hidden =
      !pill.classList.contains('active') &&
      !matchesFilterSearch(pill.dataset.search, cityFilterSearch);
  });
}

function matchesFilterSearch(value, search) {
  const wanted = search.trim().toLowerCase();
  return !wanted || value.toLowerCase().includes(wanted);
}

/*
  A row of pills to keep or drop words: one filters by clicking what the list already shows. The
  search narrows a long row without a render, which would take the focus out of the field.
*/
let filterPillSearch = '';

function filterPillBlock(title, options, searchPlaceholder) {
  const search = searchPlaceholder
    ? /* HTML */ `<input
        class="filter-search"
        type="search"
        placeholder="${searchPlaceholder}"
        value="${escapeHtml(filterPillSearch)}"
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
    search && !active && !matchesFilterSearch(search, filterPillSearch) ? 'hidden' : '';
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
  filterPillSearch = input.value;
  input.parentElement.querySelectorAll('.filter-pill[data-search]').forEach((pill) => {
    pill.hidden =
      !pill.classList.contains('active') &&
      !matchesFilterSearch(pill.dataset.search, filterPillSearch);
  });
}

function matchesFilterSearch(value, search) {
  const wanted = search.trim().toLowerCase();
  return !wanted || value.toLowerCase().includes(wanted);
}

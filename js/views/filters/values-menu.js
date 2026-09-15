/*
  Les mots d'un niveau se cochent dans un menu déroulant : un `<select>` ne sait ni en garder
  plusieurs ni porter une pastille — c'est ce qui casse quand on lui passe une icône. Le menu ne
  fait que cocher ; ranger l'ordre des mots reste au panneau Trier, un geste par menu.
*/
const FILTER_SEARCH_FROM = 8;

function filterValuesMenu(scope, level, index) {
  const kind = filterKind(scope);
  const column = filterColumn(kind, level.key);
  const values = filterValues(kind, column);
  return inlineDropdown(
    `filter-values:${scope}:${index}`,
    'filter-values-menu',
    /* HTML */ `<summary class="inline-select filter-values-summary">
        ${filterValuesSummary(column, level)}<span class="filter-values-caret">⌄</span>
      </summary>
      <div class="inline-menu">
        ${values.length >= FILTER_SEARCH_FROM ? filterSearchField('Chercher…') : ''}
        ${values
          .map((value, i) => filterValueOption(scope, index, column, level, value, i))
          .join('')}
      </div>`,
  );
}

// Au-delà de deux mots cochés, leur compte : trois pastilles ne tiennent pas dans un résumé.
function filterValuesSummary(column, level) {
  if (!level.values.length) return '<span class="filter-values-all">Toutes</span>';
  if (level.values.length > 2) return `${level.values.length} valeurs`;
  return level.values.map((value) => filterValueLabel(column, value)).join(', ');
}

function filterValueOption(scope, index, column, level, value, valueIndex) {
  const checked = level.values.includes(value);
  return /* HTML */ `<button
    class="inline-menu-item filter-value ${checked ? 'active' : ''}"
    data-search="${escapeHtml(value)}"
    ${hiddenBySearch(value, checked) ? 'hidden' : ''}
    onclick="toggleFilterValue('${scope}',${index},${valueIndex})"
  >
    <span class="filter-value-check">${checked ? svgIcon('check') : ''}</span>
    ${filterValueLabel(column, value)}
  </button>`;
}

/*
  Les mots de toutes les colonnes cochées se cochent dans un seul menu déroulant, groupé par
  colonne : la ligne du panneau ne porte qu'une paire de menus, pas une par colonne active.
*/
const FILTER_SEARCH_FROM = 8;

function filterValuesMenu(scope) {
  const kind = filterKind(scope);
  const levels = filterLevels(scope);
  const total = levels.reduce((n, level) => n + filterValues(kind, filterColumn(kind, level.key)).length, 0);
  const checked = levels.reduce((n, level) => n + levelValues(kind, level).length, 0);
  const allChecked = total > 0 && checked === total;
  return inlineDropdown(
    `filter-values:${scope}`,
    'filter-values-menu',
    /* HTML */ `<summary class="inline-select filter-values-summary">
        ${filterValuesSummary(checked, total)}<span class="filter-values-caret">⌄</span>
      </summary>
      <div class="inline-menu">
        <label class="filter-option filter-select-all">
          <input
            type="checkbox"
            ${allChecked ? 'checked' : ''}
            onchange="setAllFilterValuesEverywhere('${scope}',this.checked)"
          />
          Tout cocher
        </label>
        ${total >= FILTER_SEARCH_FROM ? filterSearchField('Chercher…') : ''}
        ${levels.map((level, i) => filterValuesGroup(scope, level, i)).join('')}
      </div>`,
  );
}

// Toutes cochées ou aucune se disent en un mot, le reste se compte au-delà de deux.
function filterValuesSummary(checked, total) {
  if (!checked) return '<span class="filter-values-all">Aucune</span>';
  if (checked === total) return '<span class="filter-values-all">Toutes</span>';
  return `${checked} valeurs`;
}

function filterValuesGroup(scope, level, index) {
  const kind = filterKind(scope);
  const column = filterColumn(kind, level.key);
  const values = filterValues(kind, column);
  const checked = levelValues(kind, level);
  return /* HTML */ `<div class="inline-menu-group">${escapeHtml(columnLabel(column))}</div>
    ${values.map((value, i) => filterValueOption(scope, index, column, checked, value, i)).join('')}`;
}

function filterValueOption(scope, index, column, checked, value, valueIndex) {
  const isChecked = checked.includes(value);
  return /* HTML */ `<label
    class="filter-option filter-value"
    data-search="${escapeHtml(value)}"
    ${hiddenBySearch(value, isChecked) ? 'hidden' : ''}
  >
    <input
      type="checkbox"
      ${isChecked ? 'checked' : ''}
      onchange="toggleFilterValue('${scope}',${index},${valueIndex})"
    />
    ${filterValueLabel(column, value)}
  </label>`;
}

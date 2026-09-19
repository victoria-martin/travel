/*
  Le panneau de filtre d'une liste : une seule ligne — « Filtrer par », le menu des colonnes, le
  menu de leurs valeurs. Rien à filtrer, pas de bouton.
  Il se rend aussi seul, pour un écran qui en compose plusieurs dans le même bouton — la carte en a
  un par collection tracée.
*/
function filterPanel(scope) {
  if (!filterableColumns(filterKind(scope)).length) return '';
  return toolbarPanel({
    key: 'filter',
    icon: svgIcon('funnel'),
    label: 'Filtrer',
    count: activeFilterCount(scope),
    align: 'left',
    body: `<div class="filter-panel">${filterLevelsBlock(scope)}</div>`,
  });
}

function filterLevelsBlock(scope) {
  const kind = filterKind(scope);
  if (!filterableColumns(kind).length) {
    return `<p class="filter-empty">Rien à filtrer sur cette liste.</p>`;
  }
  return /* HTML */ `<div class="filter-row">
    <span class="filter-rank">Filtrer par</span>
    ${filterColumnsMenu(scope)} ${filterValuesMenu(scope)}
  </div>`;
}

// Le menu des colonnes : une checkbox par colonne filtrable, « Tout cocher » en tête.
function filterColumnsMenu(scope) {
  const kind = filterKind(scope);
  const columns = filterableColumns(kind);
  const levels = filterLevels(scope);
  const allChecked = columns.length > 0 && levels.length === columns.length;
  return inlineDropdown(
    `filter-columns:${scope}`,
    'filter-values-menu',
    /* HTML */ `<summary class="inline-select filter-values-summary">
        ${filterColumnsSummary(kind, levels)}<span class="filter-values-caret">⌄</span>
      </summary>
      <div class="inline-menu">
        <label class="filter-option filter-select-all">
          <input
            type="checkbox"
            ${allChecked ? 'checked' : ''}
            onchange="setAllFilterLevels('${scope}',this.checked)"
          />
          Tout cocher
        </label>
        ${columns.map((c) => filterColumnOption(scope, levels, c)).join('')}
      </div>`,
  );
}

function filterColumnsSummary(kind, levels) {
  if (!levels.length) return '<span class="filter-values-all">Aucune</span>';
  if (levels.length > 2) return `${levels.length} colonnes`;
  return levels.map((level) => escapeHtml(columnLabel(filterColumn(kind, level.key)))).join(', ');
}

function filterColumnOption(scope, levels, column) {
  const checked = levels.some((l) => l.key === column.key);
  return /* HTML */ `<label class="filter-option">
    <input
      type="checkbox"
      ${checked ? 'checked' : ''}
      onchange="toggleFilterLevel('${scope}','${column.key}')"
    />
    ${escapeHtml(columnLabel(column))}
  </label>`;
}

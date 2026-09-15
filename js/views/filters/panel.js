/*
  Le panneau de filtre d'une liste : une ligne par niveau, sur la forme du panneau Trier — un
  libellé de rang, la colonne, ce qu'on y garde. Rien à filtrer, pas de bouton.
*/
function filterPanel(scope) {
  const kind = filterKind(scope);
  const levels = filterLevels(scope);
  if (!filterableColumns(kind).length) return '';
  return toolbarPanel({
    key: 'filter',
    icon: svgIcon('funnel'),
    label: 'Filtrer',
    count: activeFilterCount(scope),
    body: /* HTML */ `<div class="filter-panel">
      ${
        levels.length
          ? levels.map((level, i) => filterLevelRow(scope, level, i)).join('')
          : `<p class="filter-empty">Aucun filtre — la liste montre tout.</p>`
      }
      ${
        levels.length < filterableColumns(kind).length
          ? `<button class="btn btn-ghost filter-add" onclick="addFilterLevel('${scope}')">+ Ajouter un niveau</button>`
          : ''
      }
    </div>`,
  });
}

function filterLevelRow(scope, level, index) {
  const kind = filterKind(scope);
  const used = filterLevels(scope).map((l) => l.key);
  const columns = filterableColumns(kind).filter(
    (c) => c.key === level.key || !used.includes(c.key),
  );
  return /* HTML */ `<div class="filter-row">
    <span class="filter-rank">${index === 0 ? 'Filtrer par' : 'et'}</span>
    <select class="inline-select" onchange="setFilterLevelColumn('${scope}',${index},this.value)">
      ${columns
        .map(
          (c) =>
            `<option value="${c.key}" ${c.key === level.key ? 'selected' : ''}>${escapeHtml(columnLabel(c))}</option>`,
        )
        .join('')}
    </select>
    ${filterValuesMenu(scope, level, index)}
    <button class="icon-btn" onclick="removeFilterLevel('${scope}',${index})" title="Retirer">
      ${svgIcon('x')}
    </button>
  </div>`;
}

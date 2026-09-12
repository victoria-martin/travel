/*
  A column is sortable as soon as it declares `sortValue`. Criteria are ordered: the first one
  that separates two rows wins, so `statut puis ville` reads as two levels. They live in prefs,
  next to the hidden columns, because a configured sort is a deliberate choice worth keeping.
  SORT_DEFAULTS shapes a list until the user opens the panel, after which prefs.sort holds the
  full answer — an empty list meaning `no sort at all`.
*/

const SORT_DEFAULTS = {};

function defaultSortCriteria(kind) {
  return SORT_DEFAULTS[kind] || [];
}

function sortCriteria(kind) {
  return prefs.sort[kind] || defaultSortCriteria(kind);
}

function sortableColumns(kind) {
  return columnsFor(kind).filter((c) => c.sortValue);
}

function setSortCriteria(kind, criteria) {
  prefs.sort[kind] = criteria;
  persistPrefs();
  render();
}

// Order by a dictionary's declaration order; an unknown key sorts last.
function dictSortIndex(dict, key) {
  const keys = Object.keys(dict);
  return keys.includes(key) ? keys.indexOf(key) : keys.length;
}

function compareValues(left, right) {
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return String(left).localeCompare(String(right), 'fr');
}

function sortItems(kind, items) {
  const columns = columnsFor(kind);
  const levels = sortCriteria(kind)
    .map((c) => ({ dir: c.dir, column: columns.find((col) => col.key === c.key) }))
    .filter((level) => level.column && level.column.sortValue);
  if (!levels.length) return [...items];
  return [...items].sort((a, b) => {
    for (const { column, dir } of levels) {
      const diff = compareValues(column.sortValue(a), column.sortValue(b));
      if (diff) return dir === 'desc' ? -diff : diff;
    }
    return 0;
  });
}

// Clicking a header is the shortcut: it drops every level and cycles that single column.
function toggleSort(kind, key) {
  const criteria = sortCriteria(kind);
  const alone = criteria.length === 1 && criteria[0].key === key ? criteria[0] : null;
  if (!alone) setSortCriteria(kind, [{ key, dir: 'asc' }]);
  else if (alone.dir === 'asc') setSortCriteria(kind, [{ key, dir: 'desc' }]);
  else setSortCriteria(kind, []);
}

function addSortLevel(kind) {
  const used = sortCriteria(kind).map((c) => c.key);
  const next = sortableColumns(kind).find((c) => !used.includes(c.key));
  if (!next) return;
  setSortCriteria(kind, [...sortCriteria(kind), { key: next.key, dir: 'asc' }]);
}

function setSortKey(kind, index, key) {
  const criteria = sortCriteria(kind)
    .map((c, i) => (i === index ? { ...c, key } : c))
    .filter((c, i) => i === index || c.key !== key);
  setSortCriteria(kind, criteria);
}

function setSortDir(kind, index, dir) {
  setSortCriteria(
    kind,
    sortCriteria(kind).map((c, i) => (i === index ? { ...c, dir } : c)),
  );
}

function removeSortLevel(kind, index) {
  setSortCriteria(
    kind,
    sortCriteria(kind).filter((c, i) => i !== index),
  );
}

function moveSortLevel(kind, index, offset) {
  const criteria = [...sortCriteria(kind)];
  const target = index + offset;
  if (target < 0 || target >= criteria.length) return;
  [criteria[index], criteria[target]] = [criteria[target], criteria[index]];
  setSortCriteria(kind, criteria);
}

function columnHeader(kind, column) {
  if (!column.sortValue) return `<th>${column.label}</th>`;
  const criteria = sortCriteria(kind);
  const index = criteria.findIndex((c) => c.key === column.key);
  const arrow = index < 0 ? '↕' : criteria[index].dir === 'asc' ? '↑' : '↓';
  const rank = index >= 0 && criteria.length > 1 ? index + 1 : '';
  return /* HTML */ `<th>
    <button
      class="th-sort ${index >= 0 ? 'active' : ''}"
      onclick="toggleSort('${kind}','${column.key}')"
      title="Trier par ${escapeHtml(columnLabel(column))}"
    >
      ${column.label}<span class="th-sort-arrow">${arrow}${rank}</span>
    </button>
  </th>`;
}

let sortPanelOpen = false;

/*
  `filters` is the caller's own block — {html, count} — dropped above the sort levels: the panel
  owns the disclosure and the sort, the list owns what it filters on.
*/
function sortPanel(kind, filters) {
  const criteria = sortCriteria(kind);
  const canAdd = criteria.length < sortableColumns(kind).length;
  const active = criteria.length + (filters ? filters.count : 0);
  return /* HTML */ `<details
    class="col-picker"
    ${sortPanelOpen ? 'open' : ''}
    ontoggle="sortPanelOpen = this.open"
  >
    <summary>${filters ? 'Trier & filtrer' : 'Trier'}${active ? ` (${active})` : ''}</summary>
    <div class="col-picker-panel sort-panel">
      ${filters ? filters.html : ''}
      ${
        criteria.length
          ? criteria.map((c, i) => sortLevelRow(kind, c, i, criteria.length)).join('')
          : `<p class="sort-empty">Aucun tri — la liste garde son ordre d'origine.</p>`
      }
      ${
        canAdd
          ? `<button class="btn-ghost btn sort-add" onclick="addSortLevel('${kind}')">+ Ajouter un niveau</button>`
          : ''
      }
    </div>
  </details>`;
}

const DIRECTION_LABELS = { asc: 'Croissant ↑', desc: 'Décroissant ↓' };

function directionLabel(column, dir) {
  return (column && column.sortLabels && column.sortLabels[dir]) || DIRECTION_LABELS[dir];
}

function sortLevelRow(kind, criterion, index, total) {
  const column = columnsFor(kind).find((c) => c.key === criterion.key);
  const columnOptions = sortableColumns(kind)
    .map(
      (c) =>
        `<option value="${c.key}" ${c.key === criterion.key ? 'selected' : ''}>${escapeHtml(columnLabel(c))}</option>`,
    )
    .join('');
  return /* HTML */ `<div class="sort-row">
    <span class="sort-rank">${index === 0 ? 'Trier par' : 'puis par'}</span>
    <select class="inline-select" onchange="setSortKey('${kind}',${index},this.value)">
      ${columnOptions}
    </select>
    <select class="inline-select" onchange="setSortDir('${kind}',${index},this.value)">
      <option value="asc" ${criterion.dir === 'asc' ? 'selected' : ''}>
        ${escapeHtml(directionLabel(column, 'asc'))}
      </option>
      <option value="desc" ${criterion.dir === 'desc' ? 'selected' : ''}>
        ${escapeHtml(directionLabel(column, 'desc'))}
      </option>
    </select>
    <button
      class="icon-btn"
      onclick="moveSortLevel('${kind}',${index},-1)"
      title="Monter ce niveau"
      ${index === 0 ? 'disabled' : ''}
    >
      ↑
    </button>
    <button
      class="icon-btn"
      onclick="moveSortLevel('${kind}',${index},1)"
      title="Descendre ce niveau"
      ${index === total - 1 ? 'disabled' : ''}
    >
      ↓
    </button>
    <button class="icon-btn" onclick="removeSortLevel('${kind}',${index})" title="Retirer">
      ✕
    </button>
  </div>`;
}

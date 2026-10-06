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

// A dictionary column carries its own order, so reversing it says nothing: those levels stay asc.
// A level whose column no longer exists (a saved sort outliving a renamed column) is dropped.
function sortCriteria(kind) {
  const columns = columnsFor(kind);
  const known = (prefs.sort[kind] || defaultSortCriteria(kind)).filter((criterion) =>
    columns.some((c) => c.key === criterion.key && c.sortValue),
  );
  return known.map((criterion) => {
    const column = columns.find((c) => c.key === criterion.key);
    return column && column.sortOrder ? { ...criterion, dir: 'asc' } : criterion;
  });
}

function sortableColumns(kind) {
  return columnsFor(kind).filter((c) => c.sortValue);
}

function setSortCriteria(kind, criteria) {
  prefs.sort[kind] = criteria;
  persistPrefs();
  render();
}

function columnSortValue(column, item) {
  const value = column.sortValue(item);
  return column.sortOrder ? sortOrderIndex(column.sortOrder, value) : value;
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
      const diff = compareValues(columnSortValue(column, a), columnSortValue(column, b));
      if (diff) return dir === 'desc' ? -diff : diff;
    }
    return 0;
  });
}

// Clicking a header is the shortcut: it drops every level and cycles that single column.
function toggleSort(kind, key) {
  const column = columnsFor(kind).find((c) => c.key === key);
  const criteria = sortCriteria(kind);
  const alone = criteria.length === 1 && criteria[0].key === key ? criteria[0] : null;
  if (!alone) setSortCriteria(kind, [{ key, dir: 'asc' }]);
  else if (alone.dir === 'asc' && !column.sortOrder) setSortCriteria(kind, [{ key, dir: 'desc' }]);
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

const DIRECTION_LABELS = { asc: 'Croissant ↑', desc: 'Décroissant ↓' };

function directionLabel(column, dir) {
  return (column && column.sortLabels && column.sortLabels[dir]) || DIRECTION_LABELS[dir];
}

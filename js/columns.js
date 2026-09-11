/*
  Column descriptors are registered per list kind so the picker and the table read the same
  source. A column with `locked` is never hidable; `hiddenByDefault` applies until the user
  touches the picker, after which prefs.hiddenColumns holds the full answer.
*/

const COLUMN_SETS = {};

function columnsFor(kind) {
  return COLUMN_SETS[kind] || [];
}

function hiddenColumns(kind) {
  const saved = prefs.hiddenColumns[kind];
  if (saved) return saved;
  return columnsFor(kind)
    .filter((c) => c.hiddenByDefault)
    .map((c) => c.key);
}

function visibleColumns(kind) {
  const hidden = hiddenColumns(kind);
  return columnsFor(kind).filter((c) => c.locked || !hidden.includes(c.key));
}

function toggleColumn(kind, key) {
  const hidden = new Set(hiddenColumns(kind));
  if (hidden.has(key)) hidden.delete(key);
  else hidden.add(key);
  prefs.hiddenColumns[kind] = Array.from(hidden);
  persistPrefs();
  render();
}

let columnPickerOpen = false;

function columnPicker(kind) {
  const hidden = hiddenColumns(kind);
  const options = columnsFor(kind).filter((c) => !c.locked);
  return /* HTML */ `<details
    class="col-picker"
    ${columnPickerOpen ? 'open' : ''}
    ontoggle="columnPickerOpen = this.open"
  >
    <summary>Colonnes</summary>
    <div class="col-picker-panel">
      ${options
        .map(
          (c) => `<label class="filter-option">
            <input type="checkbox" ${hidden.includes(c.key) ? '' : 'checked'}
              onchange="toggleColumn('${kind}','${c.key}')" />${escapeHtml(c.pickerLabel || c.label)}
          </label>`,
        )
        .join('')}
    </div>
  </details>`;
}

/*
  A column is sortable as soon as it declares `sortValue`. Clicking its header cycles
  ascending → descending → unsorted, so the list can always go back to its natural order.
*/

function toggleSort(kind, key) {
  const current = listSort[kind];
  if (!current || current.key !== key) listSort[kind] = { key, dir: 'asc' };
  else if (current.dir === 'asc') listSort[kind] = { key, dir: 'desc' };
  else delete listSort[kind];
  render();
}

function sortItems(kind, items) {
  const sort = listSort[kind];
  const column = sort && columnsFor(kind).find((c) => c.key === sort.key);
  if (!column || !column.sortValue) return [...items];
  const factor = sort.dir === 'desc' ? -1 : 1;
  return [...items].sort((a, b) => {
    const left = column.sortValue(a);
    const right = column.sortValue(b);
    if (typeof left === 'number' && typeof right === 'number') return (left - right) * factor;
    return String(left).localeCompare(String(right), 'fr') * factor;
  });
}

function columnHeader(kind, column) {
  if (!column.sortValue) return `<th>${column.label}</th>`;
  const sort = listSort[kind];
  const active = sort && sort.key === column.key;
  const arrow = active ? (sort.dir === 'asc' ? '↑' : '↓') : '↕';
  return /* HTML */ `<th>
    <button
      class="th-sort ${active ? 'active' : ''}"
      onclick="toggleSort('${kind}','${column.key}')"
      title="Trier par ${escapeHtml(column.label)}"
    >
      ${column.label}<span class="th-sort-arrow">${arrow}</span>
    </button>
  </th>`;
}

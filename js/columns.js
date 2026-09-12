/*
  Column descriptors are registered per list kind so the picker and the table read the same
  source. A column with `locked` is never hidable; `hiddenByDefault` applies until the user
  touches the picker, after which prefs.hiddenColumns holds the full answer.
*/

const COLUMN_SETS = {};

function columnsFor(kind) {
  return COLUMN_SETS[kind] || [];
}

function columnLabel(column) {
  return column.pickerLabel || column.label;
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

function columnPicker(kind) {
  const hidden = hiddenColumns(kind);
  const options = columnsFor(kind).filter((c) => !c.locked);
  return toolbarPanel({
    key: 'columns',
    icon: '▥',
    label: 'Colonnes',
    count: options.filter((c) => hidden.includes(c.key)).length,
    body: options
      .map(
        (c) => `<label class="filter-option">
          <input type="checkbox" ${hidden.includes(c.key) ? '' : 'checked'}
            onchange="toggleColumn('${kind}','${c.key}')" />${escapeHtml(columnLabel(c))}
        </label>`,
      )
      .join(''),
  });
}

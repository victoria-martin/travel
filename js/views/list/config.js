/*
  A list generated from a declaration: `registerList` holds what the view and the modal need,
  and turns the fields it can show into columns so the list gets the sort panel and the picker
  like a hand-written one. A field renders as plain text unless it carries its own `cell`.
  Lists whose form is bespoke — accommodations, cities — declare COLUMN_SETS directly instead.
*/

const LIST_CONFIG = {};

function registerList(kind, config) {
  LIST_CONFIG[kind] = config;
  COLUMN_SETS[kind] = listColumns(kind);
}

function listColumns(kind) {
  const cfg = LIST_CONFIG[kind];
  const shown = cfg.fields.filter((f) => f.type !== 'textarea');
  return [
    ...(cfg.leadCell ? [{ key: 'lead', label: '', locked: true, cell: cfg.leadCell }] : []),
    ...shown.map((field, i) => listColumn(kind, field, i === 0)),
    { key: 'actions', label: '', locked: true, nowrap: true, cell: listActionsCell(kind) },
  ];
}

// The first column carries the notes, so hiding it would hide them too.
function listColumn(kind, field, isFirst) {
  const content = field.cell || ((item) => escapeHtml(item[field.key]) || '—');
  return {
    key: field.key,
    label: field.label,
    locked: isFirst,
    ...(field.cell ? {} : { sortValue: (item) => (item[field.key] || '').toLowerCase() }),
    cell: isFirst
      ? (item) => `${content(item)}<div class="row-notes">${listNotesEditable(kind, item)}</div>`
      : content,
  };
}

function listActionsCell(kind) {
  const dataKey = LIST_CONFIG[kind].dataKey;
  return (item) =>
    /* HTML */ `<button
        class="icon-btn"
        onclick="openModal('${kind}','${item.id}')"
        title="Modifier"
      >
        ✎
      </button>
      <button class="icon-btn" onclick="deleteItem('${dataKey}','${item.id}')" title="Supprimer">
        🗑
      </button>`;
}

function getListItem(kind, id) {
  return id ? state[LIST_CONFIG[kind].dataKey].find((x) => x.id === id) : null;
}

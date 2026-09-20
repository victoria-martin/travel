/*
  Every list renders the same table: a kind names its columns in COLUMN_SETS, the picker says
  which ones show, and each column renders its own cell.
*/

function listTable(kind, items) {
  const columns = visibleColumns(kind);
  return /* HTML */ `<div class="table-wrap table-wrap-${kind}">
    <table>
      <thead>
        <tr>
          ${columns.map((c) => columnHeader(kind, c)).join('')}
        </tr>
      </thead>
      <tbody>
        ${items.map((item) => listRow(kind, item, columns)).join('')}
      </tbody>
    </table>
  </div>`;
}

/*
  A row opens its resource when its kind has registered how; a click that landed on a cell which
  acts by itself — a tag, a field, a button — belongs to that cell and opens nothing.
*/
const ROW_CLICKS = {};
const ACTING_CELL = 'button, a, input, textarea, select, summary, label, [contenteditable]';

function listRow(kind, item, columns) {
  const open = ROW_CLICKS[kind]
    ? ` class="row-openable" onclick="openListRow(event,'${kind}','${item.id}')"`
    : '';
  return /* HTML */ `<tr${open} class="list-row">
    ${columns
      .map(
        (c) =>
          `<td${c.nowrap ? ' style="white-space:nowrap;"' : ''}${c.ellipsis ? ' class="cell-ellipsis"' : ''}>${c.cell(item)}</td>`
      )
      .join('')}
  </tr>`;
}

function openListRow(event, kind, id) {
  if (event.target.closest(ACTING_CELL)) return;
  ROW_CLICKS[kind](id);
}

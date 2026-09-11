/*
  Every list renders the same table: a kind names its columns in COLUMN_SETS, the picker says
  which ones show, and each column renders its own cell.
*/

function listTable(kind, items) {
  const columns = visibleColumns(kind);
  return /* HTML */ `<div class="table-wrap">
    <table>
      <thead>
        <tr>
          ${columns.map((c) => columnHeader(kind, c)).join('')}
        </tr>
      </thead>
      <tbody>
        ${items.map((item) => listRow(item, columns)).join('')}
      </tbody>
    </table>
  </div>`;
}

function listRow(item, columns) {
  return /* HTML */ `<tr>
    ${columns
      .map((c) => `<td${c.nowrap ? ' style="white-space:nowrap;"' : ''}>${c.cell(item)}</td>`)
      .join('')}
  </tr>`;
}

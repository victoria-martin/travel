function accommodationTable(items) {
  const columns = visibleColumns('hebergements');
  return /* HTML */ `<div class="table-wrap">
    <table>
      <thead>
        <tr>
          ${columns.map((c) => `<th>${c.label}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${items.map((a) => accommodationRow(a, columns)).join('')}
      </tbody>
    </table>
  </div>`;
}

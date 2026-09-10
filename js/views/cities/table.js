function citiesTable(items) {
  return /* HTML */ `<div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Ville</th>
          <th>Adresse à localiser / zone</th>
          <th>Coordonnées</th>
          <th>Notes</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${items.map((c) => cityRow(c)).join('')}
      </tbody>
    </table>
  </div>`;
}

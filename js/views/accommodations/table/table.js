function accommodationTable(items) {
  return /* HTML */ `<div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Type</th>
          <th>Ville / Région</th>
          <th>Prix</th>
          <th>Dates</th>
          <th>Lien</th>
          <th>Voir</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${items.map((a) => accommodationRow(a)).join('')}
      </tbody>
    </table>
  </div>`;
}

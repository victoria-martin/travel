function cityRow(c) {
  return /* HTML */ `<tr>
    <td><strong>${escapeHtml(c.name)}</strong></td>
    <td>${escapeHtml(cityPlaceLabel(c))}</td>
    <td style="white-space:nowrap;">${escapeHtml(cityCoordsLabel(c))}</td>
    <td>${escapeHtml(c.notes) || '—'}</td>
    <td style="white-space:nowrap;">
      <button class="icon-btn" onclick="openModal('ville','${c.id}')" title="Modifier">✎</button>
      <button class="icon-btn" onclick="deleteItem('cities','${c.id}')" title="Supprimer">🗑</button>
    </td>
  </tr>`;
}

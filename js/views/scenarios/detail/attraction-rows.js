// Le détail de la famille Attractions : les activités rattachées aux étapes, dans l'ordre du
// trajet. Une ligne posée plusieurs fois se lit plusieurs fois — c'est une visite par étape.
function attractionDetailRows(scenario) {
  return scenarioAttractionLines(scenario).map(attractionDetailRow).join('');
}

function attractionDetailRow(line) {
  const count = extraCount(line);
  return /* HTML */ `<div class="acc-recap-row acc-recap-sub">
    <span>${extraLabel(line)}</span>
    <span class="acc-recap-nights">${count > 1 ? extraCountLabel(count) : ''}</span>
    <strong>${formatEuros(extraAmount(line))}</strong>
  </div>`;
}

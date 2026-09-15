// Le détail de la famille Attractions : les activités rattachées aux étapes, dans l'ordre du
// trajet. Une ligne posée plusieurs fois se lit plusieurs fois — c'est une visite par étape.
function attractionDetailRows(scenario) {
  return scenarioAttractionLines(scenario).map(extraRecapRow).join('');
}

/*
  Lecture dérivée de Lieux & activités : les mêmes lieux, en table triée par ville plutôt qu'à
  plat — colonnes déclarées dans columns.js. Rien ne s'y crée ni ne s'y filtre par ville seule ; on
  garde le tri et le choix des colonnes, comme toute liste de l'app.
*/
ROW_CLICKS.villes = openAttractionSheet;

function renderVillesView() {
  const source = ofCurrentTravel(state.attractions);
  const items = sortItems('villes', source);
  const cities = new Set(source.map((a) => a.city).filter(Boolean));
  return /* HTML */ `
    <div class="view-header">
      <div>
        <h2 class="view-title">Villes</h2>
        <p class="view-sub">
          ${cities.size} ville${cities.size > 1 ? 's' : ''} — ${items.length}
          lieu${items.length > 1 ? 'x' : ''}
        </p>
      </div>
      <div class="view-header-actions">
        ${sortPanel('villes')} ${columnPicker('villes')} ${toolbarSeparator()} ${toolbarMenu()}
      </div>
    </div>
    ${
      items.length === 0
        ? emptyState(
            'Aucun lieu',
            'Ajoute une ville, un village, un premier lieu depuis Lieux & activités.',
          )
        : listTable('villes', items)
    }
  `;
}

/*
  Lecture dérivée de Lieux & activités : les mêmes lieux, en table triée par ville plutôt qu'à
  plat. Rien ne s'y crée ; le tri et le choix des colonnes restent propres à cette page.
  Code mort depuis la Phase 4 (docs/en-cours/react-migration-plan.md § 1) : plus aucun chemin n'appelle
  renderCitiesView(), remplacé par src/domains/cities/CitiesView.tsx dans
  src/shell/MainContent.tsx. Gardé pour l'instant — pas encore retiré du bundle legacy, la clé
  'cities' (COLUMN_SETS, SORT_DEFAULTS, prefs) doit rester la même si on le supprime un jour.
*/
ROW_CLICKS.cities = openAttractionSheet;

function renderCitiesView() {
  const source = ofCurrentTravel(state.attractions);
  const items = sortItems('cities', listSearchItems('cities', source));
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
        ${listSearchField('cities')} ${sortPanel('cities')} ${columnPicker('cities')}
        ${toolbarSeparator()} ${toolbarMenu()}
      </div>
    </div>
    ${
      items.length === 0
        ? emptyState(
            'Aucun lieu',
            'Ajoute une ville, un village, un premier lieu depuis Lieux & activités.',
          )
        : listTable('cities', items)
    }
  `;
}

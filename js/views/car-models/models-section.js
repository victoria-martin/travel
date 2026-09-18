// Le catalogue du voyage : une Golf, quel que soit le nombre de loueurs qui la proposent.
function carModelsSection() {
  const models = sortItems('modeles', travelCarModels());
  return /* HTML */ `<section class="list-section">
    <div class="list-section-head">
      <h3 class="list-section-title">Modèles</h3>
      <div class="list-section-actions">
        ${sortPanel('modeles')} ${columnPicker('modeles')} ${toolbarSeparator()}
        ${toolbarButton({ icon: svgIcon('plus'), label: 'Modèle', onclick: "openModal('modele')" })}
      </div>
    </div>
    ${
      models.length
        ? listTable('modeles', models)
        : emptyState(
            'Aucun modèle',
            'Ajoute un modèle, ou tape-le en relevant une offre : il rejoint le catalogue.',
          )
    }
  </section>`;
}

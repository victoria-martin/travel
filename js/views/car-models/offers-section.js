// Les tarifs relevés, à plat : modèles et loueurs mêlés, rangés par la colonne qu'on vient
// comparer. Le tri par défaut regroupe les offres d'un même modèle, du moins cher au plus cher.
function carOffersSection() {
  const offers = sortItems('locations', ofCurrentTravel(state.offers));
  return /* HTML */ `<section class="list-section">
    <div class="list-section-head">
      <h3 class="list-section-title">Offres</h3>
      <div class="list-section-actions">
        ${sortPanel('locations')} ${columnPicker('locations')}
        ${toolbarButton({ icon: svgIcon('plus'), label: 'Offre', onclick: "openModal('voiture')" })}
      </div>
    </div>
    ${
      offers.length
        ? listTable('locations', offers)
        : emptyState(
            'Aucune offre',
            "Relève ce qu'un loueur demande : un modèle, un prix par jour.",
          )
    }
  </section>`;
}

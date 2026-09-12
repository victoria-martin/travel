function citiesHeader(items) {
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Villes</h2>
      <p class="view-sub">
        Étapes possibles en Italie — ${items.length} ville${items.length > 1 ? 's' : ''}
      </p>
    </div>
    <div class="view-header-actions">
      ${sortPanel('villes')} ${columnPicker('villes')}
      ${toolbarButton({ icon: '+', label: 'Ajouter', onclick: "openModal('ville')" })}
      ${toolbarMenu()}
    </div>
  </div>`;
}

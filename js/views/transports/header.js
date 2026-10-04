function transportsHeader() {
  const tab = currentTransportsTab();
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Transports</h2>
    </div>
    <div class="view-header-actions">${tab.actions()} ${toolbarSeparator()} ${toolbarMenu()}</div>
    ${transportsTabs()}
  </div>`;
}

function transportsCount() {
  return ofCurrentTravel(state.transports).length;
}

// Seul l'onglet Trajets n'a pas sa propre recherche (ni providersHeaderActions ni
// renderCarModelsTab n'en manquent une) : la sienne vit ici plutôt que dans transportsHeader,
// pour ne pas s'afficher sur les deux autres onglets.
function transportsHeaderActions() {
  return /* HTML */ `${listSearchField('transports')} ${sortPanel('transports')}
  ${columnPicker('transports')} ${toolbarSeparator()}
  ${toolbarButton({ icon: svgIcon('plus'), label: 'Ajouter', onclick: "openModal('transport')", primary: true })}`;
}

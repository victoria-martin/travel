function transportsHeader() {
  const tab = currentTransportsTab();
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Transports</h2>
    </div>
    <div class="view-header-actions">${tab.actions()} ${toolbarMenu()}</div>
    ${transportsTabs()}
  </div>`;
}

function transportsCount() {
  return ofCurrentTravel(state.transports).length;
}

function transportsHeaderActions() {
  return /* HTML */ `${sortPanel('transports')} ${columnPicker('transports')}
  ${toolbarButton({ icon: svgIcon('plus'), label: 'Ajouter', onclick: "openModal('transport')" })}`;
}

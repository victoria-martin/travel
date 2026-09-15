function transportsHeader() {
  const tab = currentTransportsTab();
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Transports</h2>
      <p class="view-sub">${tab.label} — ${tab.sub()}</p>
    </div>
    <div class="view-header-actions">
      ${transportsTabToggle()} ${tab.actions()} ${toolbarMenu()}
    </div>
  </div>`;
}

function transportsHeaderSub() {
  const items = ofCurrentTravel(state.transports);
  return `${items.length} enregistré${items.length > 1 ? 's' : ''}`;
}

function transportsHeaderActions() {
  return /* HTML */ `${sortPanel('transports')} ${columnPicker('transports')}
  ${toolbarButton({ icon: svgIcon('plus'), label: 'Ajouter', onclick: "openModal('transport')" })}`;
}

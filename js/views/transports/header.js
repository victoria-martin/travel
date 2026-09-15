function transportsHeader() {
  const providers = transportsTab === 'prestataires';
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Transports</h2>
      <p class="view-sub">${providers ? providersHeaderSub() : transportsHeaderSub()}</p>
    </div>
    <div class="view-header-actions">
      ${transportsTabToggle()} ${providers ? providersHeaderActions() : transportsHeaderActions()}
      ${toolbarMenu()}
    </div>
  </div>`;
}

function transportsHeaderSub() {
  const items = ofCurrentTravel(state.transports);
  return /* HTML */ `${Object.values(TRANSPORT_MODES)
    .map((m) => m.label)
    .join(' · ')}
  — ${items.length} trajet${items.length > 1 ? 's' : ''}`;
}

function transportsHeaderActions() {
  return /* HTML */ `${sortPanel('transports')} ${columnPicker('transports')}
  ${toolbarButton({ icon: '+', label: 'Ajouter', onclick: "openModal('transport')" })}`;
}

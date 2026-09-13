function transportsHeader(items) {
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Transports</h2>
      <p class="view-sub">
        ${Object.values(TRANSPORT_MODES)
          .map((m) => m.label)
          .join(' · ')}
        — ${items.length} trajet${items.length > 1 ? 's' : ''}
      </p>
    </div>
    <div class="view-header-actions">
      ${sortPanel('transports')} ${columnPicker('transports')}
      ${toolbarButton({ icon: '+', label: 'Ajouter', onclick: "openModal('transport')" })}
      ${toolbarMenu()}
    </div>
  </div>`;
}

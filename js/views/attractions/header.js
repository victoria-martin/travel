function attractionsHeader(items) {
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Attractions</h2>
      <p class="view-sub">
        ${Object.values(ATTRACTION_TYPES)
          .map((t) => t.label)
          .join(' · ')}
        — ${items.length} lieu${items.length > 1 ? 'x' : ''}
      </p>
    </div>
    <div class="view-header-actions">
      ${sortPanel('attractions')} ${columnPicker('attractions')}
      ${toolbarButton({ icon: '+', label: 'Ajouter', onclick: "openModal('attraction')" })}
      ${toolbarMenu()}
    </div>
  </div>`;
}

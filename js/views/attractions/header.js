function attractionsHeader(items) {
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Lieux &amp; activités</h2>
      <p class="view-sub">
        ${Object.values(ATTRACTION_TYPES)
          .map((t) => t.label)
          .join(' · ')}
        — ${items.length} lieu${items.length > 1 ? 'x' : ''}
      </p>
    </div>
    <div class="view-header-actions">
      ${sortPanel('attractions')} ${columnPicker('attractions')} ${toolbarSeparator()}
      ${toolbarButton({ icon: svgIcon('plus'), label: 'Ajouter', onclick: "openModal('attraction')" })}
      ${toolbarSeparator()} ${toolbarMenu()}
    </div>
  </div>`;
}

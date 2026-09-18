function packingCatalogHeader(items) {
  const mode = listViewMode.valise;
  return /* HTML */ `<div class="list-section-head">
    <h3 class="list-section-title">Catalogue</h3>
    <div class="list-section-actions">
      ${
        mode === 'table'
          ? `${sortPanel('valise')} ${columnPicker('valise')} ${toolbarSeparator()}`
          : ''
      }
      ${listModeToggle('valise', mode)} ${toolbarSeparator()}
      ${toolbarButton({
        icon: svgIcon('plus'),
        label: 'Item',
        onclick: "openModal('valise-catalogue')",
      })}
    </div>
  </div>`;
}

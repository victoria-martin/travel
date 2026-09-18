function expensesHeader() {
  const mode = listViewMode.charges;
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Dépenses</h2>
      <p class="view-sub">Ce que le voyage coûte — calculé depuis les pages, et saisi à la main</p>
    </div>
    <div class="view-header-actions">
      ${
        mode === 'table'
          ? `${sortPanel('charges')} ${columnPicker('charges')} ${toolbarSeparator()}`
          : ''
      }
      ${listModeToggle('charges', mode)} ${toolbarSeparator()}
      ${toolbarButton({ icon: svgIcon('plus'), label: 'Ajouter', onclick: "openModal('charge')" })}
      ${toolbarSeparator()} ${toolbarMenu()}
    </div>
  </div>`;
}

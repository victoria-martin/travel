function expensesHeader() {
  const mode = listViewMode.charges;
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Dépenses</h2>
      <p class="view-sub">Ce que le voyage coûte — calculé depuis les pages, et saisi à la main</p>
    </div>
    <div class="view-header-actions">
      ${mode === 'table' ? sortPanel('charges') : ''}
      ${mode === 'table' ? columnPicker('charges') : ''} ${listModeToggle('charges', mode)}
      ${toolbarButton({ icon: '+', label: 'Ajouter', onclick: "openModal('charge')" })}
      ${toolbarMenu()}
    </div>
  </div>`;
}

function fixedCostsHeader(items) {
  const mode = listViewMode.charges;
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Charges fixes</h2>
      <p class="view-sub">
        Péages, assurances, abonnements liés au voyage — ${items.length}
        enregistrée${items.length > 1 ? 's' : ''}
      </p>
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

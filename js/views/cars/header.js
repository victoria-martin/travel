function carsHeader(items) {
  const mode = listViewMode.voitures;
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Voitures</h2>
      <p class="view-sub">
        Options de location — ${items.length} enregistrée${items.length > 1 ? 's' : ''}
      </p>
    </div>
    <div class="view-header-actions">
      ${mode === 'table' ? sortPanel('voitures') : ''}
      ${mode === 'table' ? columnPicker('voitures') : ''} ${listModeToggle('voitures', mode)}
      ${toolbarButton({ icon: '+', label: 'Ajouter', onclick: "openModal('voiture')" })}
      ${toolbarMenu()}
    </div>
  </div>`;
}

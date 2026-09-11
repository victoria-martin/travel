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
    <div style="display:flex; gap:10px; align-items:center;">
      ${mode === 'table' ? sortPanel('charges') : ''}
      ${mode === 'table' ? columnPicker('charges') : ''}
      <div class="toggle-group">
        <button
          class="${mode === 'table' ? 'active' : ''}"
          onclick="setListMode('charges','table')"
        >
          Tableau
        </button>
        <button class="${mode === 'card' ? 'active' : ''}" onclick="setListMode('charges','card')">
          Cartes
        </button>
      </div>
      <button class="btn" onclick="openModal('charge')">+ Ajouter</button>
    </div>
  </div>`;
}

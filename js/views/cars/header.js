function carsHeader(items) {
  const mode = listViewMode.voitures;
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Voitures</h2>
      <p class="view-sub">
        Options de location — ${items.length} enregistrée${items.length > 1 ? 's' : ''}
      </p>
    </div>
    <div style="display:flex; gap:10px; align-items:center;">
      ${mode === 'table' ? sortPanel('voitures') : ''}
      ${mode === 'table' ? columnPicker('voitures') : ''}
      <div class="toggle-group">
        <button
          class="${mode === 'table' ? 'active' : ''}"
          onclick="setListMode('voitures','table')"
        >
          Tableau
        </button>
        <button class="${mode === 'card' ? 'active' : ''}" onclick="setListMode('voitures','card')">
          Cartes
        </button>
      </div>
      <button class="btn" onclick="openModal('voiture')">+ Ajouter</button>
    </div>
  </div>`;
}

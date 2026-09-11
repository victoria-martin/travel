function accommodationsHeader(items) {
  const mode = listViewMode.hebergements;
  const favOnly = !!listFilters.favOnly;
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Hébergements</h2>
      <p class="view-sub">
        ${Object.values(ACCOMMODATION_TYPES)
          .map((t) => t.label)
          .join(' · ')}
        — ${items.length} enregistré${items.length > 1 ? 's' : ''}
      </p>
    </div>
    <div style="display:flex; gap:10px; align-items:center;">
      <button
        style="padding: 7px 7px;"
        class="filter-toggle ${favOnly ? 'active' : ''}"
        onclick="toggleFavOnly()"
      >
        ⭐
      </button>
      ${mode === 'table' ? sortPanel('hebergements', tagFilterBlock()) : ''}
      ${mode === 'table' ? columnPicker('hebergements') : ''}
      <div class="toggle-group">
        <button
          class="${mode === 'table' ? 'active' : ''}"
          onclick="setListMode('hebergements','table')"
        >
          Tableau
        </button>
        <button
          class="${mode === 'card' ? 'active' : ''}"
          onclick="setListMode('hebergements','card')"
        >
          Cartes
        </button>
      </div>
      <button class="btn" onclick="openModal('accommodation')">+ Ajouter</button>
    </div>
  </div>`;
}
// btn should have same height as columnPicker

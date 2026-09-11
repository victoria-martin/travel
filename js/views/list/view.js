function renderListView(kind) {
  const cfg = LIST_CONFIG[kind];
  const items = sortItems(kind, state[cfg.dataKey]);
  const mode = listViewMode[kind];
  return /* HTML */ `
    <div class="view-header">
      <div>
        <h2 class="view-title">${cfg.title}</h2>
        <p class="view-sub">
          ${cfg.subtitle} — ${items.length} enregistré${items.length > 1 ? 's' : ''}
        </p>
      </div>
      <div style="display:flex; gap:10px; align-items:center;">
        ${mode === 'table' ? sortPanel(kind) : ''} ${mode === 'table' ? columnPicker(kind) : ''}
        <div class="toggle-group">
          <button
            class="${mode === 'table' ? 'active' : ''}"
            onclick="setListMode('${kind}','table')"
          >
            Tableau
          </button>
          <button
            class="${mode === 'card' ? 'active' : ''}"
            onclick="setListMode('${kind}','card')"
          >
            Cartes
          </button>
        </div>
        <button class="btn" onclick="openModal('${kind}')">+ Ajouter</button>
      </div>
    </div>
    ${
      items.length === 0
        ? emptyState(
            `Aucune entrée`,
            `Ajoute ta première ligne dans « ${cfg.title.toLowerCase()} ».`,
          )
        : mode === 'table'
          ? listTable(kind, items)
          : listCards(kind, items)
    }
  `;
}

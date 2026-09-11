function citiesHeader(items) {
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Villes</h2>
      <p class="view-sub">
        Étapes possibles en Italie — ${items.length} ville${items.length > 1 ? 's' : ''}
      </p>
    </div>
    <div style="display:flex; gap:10px; align-items:center;">
      ${sortPanel('villes')} ${columnPicker('villes')}
      <button class="btn" onclick="openModal('ville')">+ Ajouter</button>
    </div>
  </div>`;
}

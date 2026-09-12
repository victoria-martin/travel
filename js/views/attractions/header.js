function attractionsHeader(items) {
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Attractions</h2>
      <p class="view-sub">
        ${Object.values(ATTRACTION_TYPES)
          .map((t) => t.label)
          .join(' · ')}
        — ${items.length} lieu${items.length > 1 ? 'x' : ''}
      </p>
    </div>
    <div style="display:flex; gap:10px; align-items:center;">
      ${sortPanel('attractions')} ${columnPicker('attractions')}
      <button class="btn" onclick="openModal('attraction')">+ Ajouter</button>
    </div>
  </div>`;
}

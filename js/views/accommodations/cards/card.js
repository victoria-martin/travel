function accommodationCard(a) {
  return /* HTML */ `<div class="card">
    <div class="card-top">
      <p class="card-name">${escapeHtml(a.name)}</p>
      <div style="display:flex; gap:6px; align-items:center; flex-shrink:0;">
        <span class="tag ${accType(a.type).tagClass}">${accType(a.type).short}</span>
        <button
          class="icon-btn"
          style="border:none; font-size:16px; color:${a.favorite ? '#C98A3E' : 'var(--line)'};"
          onclick="toggleFavorite('${a.id}')"
          title="${a.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}"
        >
          ${a.favorite ? '★' : '☆'}
        </button>
      </div>
    </div>
    <div class="card-meta">
      <span>📍 ${escapeHtml(a.city)}${a.region ? ` · ${escapeHtml(a.region)}` : ''}</span>
      ${a.price ? `<span>💶 ${escapeHtml(a.price)} €</span>` : ''}
      ${a.dates ? `<span>📅 ${escapeHtml(a.dates)}</span>` : ''}
      ${a.notes ? `<span>📝 ${escapeHtml(a.notes)}</span>` : ''}
    </div>
    <div class="card-actions">
      <button class="btn-ghost btn btn-small" onclick="openModal('accommodation','${a.id}')">
        Modifier
      </button>
      <button class="btn-danger btn btn-small" onclick="deleteItem('accommodations','${a.id}')">
        Suppr.
      </button>
      ${a.link ? `<a href="${escapeHtml(a.link)}" target="_blank" class="btn-ghost btn btn-small" style="text-decoration:none;">Lien</a>` : ''}
    </div>
  </div>`;
}

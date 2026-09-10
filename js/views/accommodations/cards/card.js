function accommodationCard(a) {
  return /* HTML */ `<div class="card">
    <div class="card-top">
      <p class="card-name">${escapeHtml(a.name)}</p>
      <button
        class="icon-btn"
        style="border:none; font-size:16px; flex-shrink:0; color:${a.favorite ? '#C98A3E' : 'var(--line)'};"
        onclick="toggleFavorite('${a.id}')"
        title="${a.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}"
      >
        ${a.favorite ? '★' : '☆'}
      </button>
    </div>
    <div class="card-selects">${accommodationTypeSelect(a)}${accommodationStatusSelect(a)}</div>
    <div class="card-meta">
      <span
        >📍
        ${[a.city, a.county].filter(Boolean).map(escapeHtml).join(' · ') || 'non localisé'}</span
      >
      ${a.price ? `<span>💶 ${escapeHtml(a.price)} €</span>` : ''}
      ${a.dates ? `<span>📅 ${escapeHtml(a.dates)}</span>` : ''}
      <span>📝 ${notesEditable(a)}</span>
    </div>
    <div class="card-actions">
      <button class="btn-ghost btn btn-small" onclick="openModal('accommodation','${a.id}')">
        Modifier
      </button>
      <button class="btn-danger btn btn-small" onclick="deleteItem('accommodations','${a.id}')">
        Suppr.
      </button>
      ${a.link ? `<a href="${escapeHtml(a.link)}" target="_blank" class="btn-ghost btn btn-small" style="text-decoration:none;">Lien</a>` : ''}
      ${a.bookingLink ? `<a href="${escapeHtml(a.bookingLink)}" target="_blank" class="btn-ghost btn btn-small" style="text-decoration:none;">Booking</a>` : ''}
    </div>
  </div>`;
}

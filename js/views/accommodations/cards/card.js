function accommodationCard(a) {
  return /* HTML */ `<div class="card">
    <div class="card-top">
      <p class="card-name">${escapeHtml(a.name)}</p>
      ${favoriteStar(a.favorite, `toggleFavorite('${a.id}')`)}
    </div>
    <div class="card-selects">${accommodationTypeSelect(a)}${accommodationStatusSelect(a)}</div>
    <div class="card-meta">
      <span
        >📍
        ${[a.city, a.county].filter(Boolean).map(escapeHtml).join(' · ') || 'non localisé'}</span
      >
      ${a.price ? `<span>💶 ${escapeHtml(a.price)} ${accommodationPriceUnit(a)}</span>` : ''}
      ${a.dates ? `<span>📅 ${escapeHtml(a.dates)}</span>` : ''}
      <span>📝 ${notesEditable(a)}</span>
    </div>
    ${tagChips(a.tags)}
    <div class="card-actions">
      <button class="btn-ghost btn btn-small" onclick="openModal('accommodation','${a.id}')">
        Modifier
      </button>
      <button class="btn-danger btn btn-small" onclick="deleteItem('accommodations','${a.id}')">
        Suppr.
      </button>
      ${a.link ? linkButton(a.link, 'Lien') : ''}
      ${a.bookingLink ? linkButton(a.bookingLink, 'Booking') : ''}
    </div>
  </div>`;
}

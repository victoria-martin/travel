function accommodationCard(a) {
  return /* HTML */ `<div class="card">
    <div class="card-top">
      <p class="card-name">${escapeHtml(a.name)}</p>
      ${favoriteStar(a.favorite, `toggleFavorite('${a.id}')`)}
    </div>
    <div class="card-selects">${accommodationTypeDropdown(a)}${accommodationStatusTag(a)}</div>
    <div class="card-meta">
      <span
        >📍
        ${[a.city, a.county].filter(Boolean).map(escapeHtml).join(' · ') || 'non localisé'}</span
      >
      <span>💶 ${priceEditable(a)}</span>
      ${a.dates ? `<span>📅 ${escapeHtml(a.dates)}</span>` : ''}
      <span>📝 ${notesEditable(a)}</span>
    </div>
    ${tagChips(a.tags)}
    <div class="card-actions">
      ${cardEditButton('accommodation', a.id)} ${cardDeleteButton('accommodations', a.id)}
      ${a.link ? linkButton(a.link, 'Lien') : ''}
      ${a.bookingLink ? linkButton(a.bookingLink, 'Booking') : ''}
    </div>
  </div>`;
}

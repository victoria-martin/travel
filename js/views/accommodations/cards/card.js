function accommodationCard(a) {
  return /* HTML */ `<div class="card">
    <div class="card-top">
      <p class="card-name">${escapeHtml(a.name)}</p>
      ${favoriteStar(a.favorite, `toggleFavorite('${a.id}')`)}
    </div>
    <div class="card-selects">${accommodationTypeDropdown(a)}${accommodationStatusTag(a)}</div>
    <div class="card-meta">
      <span
        >${svgIcon('map-pin')}
        ${[a.city, a.county].filter(Boolean).map(escapeHtml).join(' · ') || 'non localisé'}</span
      >
      <span>${svgIcon('euro')} ${priceEditable(a)}</span>
      ${a.dates ? `<span>${svgIcon('calendar')} ${escapeHtml(a.dates)}</span>` : ''}
      <span>${svgIcon('file-text')} ${notesEditable(a)}</span>
    </div>
    ${tagChips(a.tags)}
    <div class="card-actions">
      ${cardEditButton('accommodation', a.id)} ${cardDeleteButton('accommodations', a.id)}
      ${a.link ? linkButton(a.link, 'Lien') : ''}
      ${a.bookingLink ? linkButton(a.bookingLink, 'Booking') : ''}
    </div>
  </div>`;
}

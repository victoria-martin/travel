const ACCOMMODATION_COLUMNS = [
  { key: 'favorite', label: '', pickerLabel: '⭐ Favori', locked: true, cell: favoriteCell },
  { key: 'name', label: 'Nom', locked: true, cell: nameCell },
  { key: 'type', label: 'Type', cell: typeCell },
  { key: 'status', label: 'Statut', cell: statusCell },
  { key: 'city', label: 'Ville', cell: (a) => escapeHtml(a.city) || '—' },
  { key: 'county', label: 'Province', cell: (a) => escapeHtml(a.county) || '—' },
  {
    key: 'region',
    label: 'Région',
    hiddenByDefault: true,
    cell: (a) => escapeHtml(a.region) || '—',
  },
  { key: 'address', label: 'Adresse', hiddenByDefault: true, cell: addressCell },
  { key: 'price', label: 'Prix', cell: (a) => (a.price ? `${escapeHtml(a.price)} €` : '—') },
  { key: 'dates', label: 'Dates', cell: (a) => escapeHtml(a.dates) || '—' },
  { key: 'link', label: 'Lien', cell: linkCell },
  { key: 'bookingLink', label: 'Booking', cell: bookingLinkCell },
  { key: 'actions', label: '', locked: true, cell: actionsCell },
];

COLUMN_SETS.hebergements = ACCOMMODATION_COLUMNS;

function favoriteCell(a) {
  return /* HTML */ `<button
    class="icon-btn"
    style="border:none; font-size:15px; color:${a.favorite ? '#C98A3E' : 'var(--line)'};"
    onclick="toggleFavorite('${a.id}')"
    title="${a.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}"
  >
    ${a.favorite ? '★' : '☆'}
  </button>`;
}

function nameCell(a) {
  const notes = a.notes
    ? `<div style="color:var(--ink-soft); font-size:12px; margin-top:2px;">${escapeHtml(a.notes)}</div>`
    : '';
  return `<strong>${escapeHtml(a.name)}</strong>${notes}`;
}

function typeCell(a) {
  return `<span class="tag ${accType(a.type).tagClass}">${accType(a.type).label}</span>`;
}

function statusCell(a) {
  return `<span class="tag ${accStatus(a.status).tagClass}">${accStatus(a.status).label}</span>`;
}

function addressCell(a) {
  return escapeHtml(a.address) || '—';
}

function linkCell(a) {
  if (!a.link) return '—';
  return `<a href="${escapeHtml(a.link)}" target="_blank" style="color:var(--stone-dark);">Voir</a>`;
}

function bookingLinkCell(a) {
  if (!a.bookingLink) return '—';
  return `<a href="${escapeHtml(a.bookingLink)}" target="_blank" style="color:var(--stone-dark);">Booking</a>`;
}

function actionsCell(a) {
  return /* HTML */ `<button
      class="icon-btn"
      onclick="openModal('accommodation','${a.id}')"
      title="Modifier"
    >
      ✎
    </button>
    <button class="icon-btn" onclick="deleteItem('accommodations','${a.id}')" title="Supprimer">
      🗑
    </button>`;
}

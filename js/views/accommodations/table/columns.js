const ACCOMMODATION_COLUMNS = [
  { key: 'favorite', label: '', pickerLabel: '⭐ Favori', locked: true, cell: favoriteCell },
  { key: 'name', label: 'Nom', locked: true, cell: nameCell },
  { key: 'type', label: 'Type', cell: typeCell, sortValue: (a) => accType(a.type).label },
  {
    key: 'status',
    label: 'Statut',
    cell: statusCell,
    sortValue: (a) => Object.keys(ACCOMMODATION_STATUSES).indexOf(accStatusKey(a.status)),
  },
  {
    key: 'city',
    label: 'Ville',
    cell: (a) => escapeHtml(a.city) || '—',
    sortValue: (a) => (a.city || '').toLowerCase(),
  },
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
  { key: 'notes', label: 'Notes', hiddenByDefault: true, cell: notesCell },
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
  const notes = `<div style="color:var(--ink-soft); font-size:12px; margin-top:2px;">${notesEditable(a)}</div>`;
  return `<strong>${escapeHtml(a.name)}</strong>${notes}`;
}

function notesCell(a) {
  return notesEditable(a);
}

function typeCell(a) {
  return accommodationTypeSelect(a);
}

function statusCell(a) {
  return accommodationStatusSelect(a);
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

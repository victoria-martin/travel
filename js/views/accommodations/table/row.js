function accommodationRow(a) {
  // return /* HTML */ `<tr class="flex">
  return /* HTML */ `<tr>
    <td>
      <button
        class="icon-btn"
        style="border:none; font-size:15px; color:${a.favorite ? '#C98A3E' : 'var(--line)'};"
        onclick="toggleFavorite('${a.id}')"
        title="${a.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}"
      >
        ${a.favorite ? '★' : '☆'}
      </button>
    </td>
    <td>
      <strong>${escapeHtml(a.name)}</strong
      >${a.notes ? `<div style="color:var(--ink-soft); font-size:12px; margin-top:2px;">${escapeHtml(a.notes)}</div>` : ''}
    </td>
    <td>
      <span class="tag ${accType(a.type).tagClass}">${accType(a.type).label}</span>
    </td>
    <td>${escapeHtml(a.city)}${a.region ? ` · ${escapeHtml(a.region)}` : ''}</td>
    <td>${a.price ? escapeHtml(a.price) + ' €' : '—'}</td>
    <td>${escapeHtml(a.dates) || '—'}</td>
    <td>
      ${a.link ? `<a href="${escapeHtml(a.link)}" target="_blank" style="color:var(--stone-dark);">Voir</a>` : '—'}
    </td>
    <td style="white-space:nowrap;">
      <button class="icon-btn" onclick="openModal('accommodation','${a.id}')" title="Modifier">
        ✎
      </button>
      <button class="icon-btn" onclick="deleteItem('accommodations','${a.id}')" title="Supprimer">
        🗑
      </button>
    </td>
  </tr>`;
}

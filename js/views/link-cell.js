function linkCell(item) {
  if (!item.link) return '—';
  return `<a href="${escapeHtml(item.link)}" target="_blank" style="color:var(--stone-dark);">Voir</a>`;
}

function linkButton(url, label) {
  return `<a href="${escapeHtml(url)}" target="_blank" class="btn-ghost btn btn-small" style="text-decoration:none;">${label}</a>`;
}

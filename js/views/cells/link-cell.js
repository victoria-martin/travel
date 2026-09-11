function linkCell(item) {
  if (!item.link) return '—';
  return `<a href="${escapeHtml(item.link)}" target="_blank" style="color:var(--stone-dark);">Voir</a>`;
}

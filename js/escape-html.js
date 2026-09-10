function escapeHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str).replace(
    /[&<>"']/g,
    (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m],
  );
}

function linkButton(url, label) {
  return `<a href="${escapeHtml(url)}" target="_blank" class="btn-ghost btn btn-small" style="text-decoration:none;">${label}</a>`;
}

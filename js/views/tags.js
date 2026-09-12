function tagChips(tags) {
  if (!tags || !tags.length) return '';
  return /* HTML */ `<span class="tag-chips">
    ${tags.map((tag) => `<span class="tag-chip">${escapeHtml(tag)}</span>`).join('')}
  </span>`;
}

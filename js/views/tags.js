/*
  Tags are free text carried by the accommodation itself: the list of options is the union of
  what is already in use, so a new tag exists as soon as it is typed somewhere.
*/
function allTags() {
  const set = new Set();
  ofCurrentTravel(state.accommodations).forEach((a) =>
    (a.tags || []).forEach((tag) => set.add(tag)),
  );
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'fr'));
}

function tagChips(tags) {
  if (!tags || !tags.length) return '';
  return /* HTML */ `<span class="tag-chips">
    ${tags.map((tag) => `<span class="tag-chip">${escapeHtml(tag)}</span>`).join('')}
  </span>`;
}

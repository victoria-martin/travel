function setAttractionStatus(id, status) {
  getAttraction(id).status = status;
  saveNow();
  render();
}

function pickAttractionStatus(id, status) {
  openInlineMenu = null;
  setAttractionStatus(id, status);
}

function attractionStatusTag(a) {
  const current = attractionStatus(a.status);
  return inlineDropdown(
    `attraction-status:${a.id}`,
    'status-dropdown',
    /* HTML */ `<summary class="inline-tag">${tagLabel(current.emoji, current.label)}</summary>
      <div class="inline-menu">
        ${Object.entries(ATTRACTION_STATUSES)
          .map(
            ([key, s]) => `<button
            class="inline-menu-item ${s === current ? 'selected' : ''}"
            onclick="pickAttractionStatus('${a.id}', '${key}')"
          >
            ${tagLabel(s.emoji, s.label)}
          </button>`,
          )
          .join('')}
      </div>`,
  );
}

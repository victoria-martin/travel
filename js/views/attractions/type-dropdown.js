function setAttractionType(id, type) {
  getAttraction(id).type = type;
  saveNow();
  render();
}

function pickAttractionType(id, type) {
  openInlineMenu = null;
  setAttractionType(id, type);
}

function attractionTypeDropdown(a) {
  const current = attractionType(a.type);
  return inlineDropdown(
    `attraction-type:${a.id}`,
    'type-dropdown',
    /* HTML */ `<summary class="inline-tag">${tagLabel(current.emoji, current.label)}</summary>
      <div class="inline-menu">
        ${Object.entries(ATTRACTION_TYPES)
          .map(
            ([key, t]) => `<button
            class="inline-menu-item ${t === current ? 'selected' : ''}"
            onclick="pickAttractionType('${a.id}', '${key}')"
          >
            ${tagLabel(t.emoji, t.label)}
          </button>`,
          )
          .join('')}
      </div>`,
  );
}

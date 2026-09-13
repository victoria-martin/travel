function setTransportMode(id, mode) {
  getTransport(id).mode = mode;
  saveNow();
  render();
}

function pickTransportMode(id, mode) {
  openInlineMenu = null;
  setTransportMode(id, mode);
}

function transportModeDropdown(t) {
  const current = transportMode(t.mode);
  return inlineDropdown(
    `transport-mode:${t.id}`,
    'type-dropdown',
    /* HTML */ `<summary class="inline-tag">${tagLabel(current.emoji, current.label)}</summary>
      <div class="inline-menu">
        ${Object.entries(TRANSPORT_MODES)
          .map(
            ([key, m]) => `<button
            class="inline-menu-item ${m === current ? 'selected' : ''}"
            onclick="pickTransportMode('${t.id}', '${key}')"
          >
            ${tagLabel(m.emoji, m.label)}
          </button>`,
          )
          .join('')}
      </div>`,
  );
}

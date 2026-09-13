function setTransportStatus(id, status) {
  getTransport(id).status = status;
  saveNow();
  render();
}

function pickTransportStatus(id, status) {
  openInlineMenu = null;
  setTransportStatus(id, status);
}

function transportStatusTag(t) {
  const current = transportStatus(t.status);
  return inlineDropdown(
    `transport-status:${t.id}`,
    'status-dropdown',
    /* HTML */ `<summary class="inline-tag">${tagLabel(current.emoji, current.label)}</summary>
      <div class="inline-menu">
        ${Object.entries(TRANSPORT_STATUSES)
          .map(
            ([key, s]) => `<button
            class="inline-menu-item ${s === current ? 'selected' : ''}"
            onclick="pickTransportStatus('${t.id}', '${key}')"
          >
            ${tagLabel(s.emoji, s.label)}
          </button>`,
          )
          .join('')}
      </div>`,
  );
}

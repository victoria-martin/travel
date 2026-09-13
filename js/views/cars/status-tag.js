function setCarStatus(id, status) {
  getCar(id).status = status;
  saveNow();
  render();
}

function pickCarStatus(id, status) {
  openInlineMenu = null;
  setCarStatus(id, status);
}

function carStatusTag(c) {
  const current = carStatus(c.status);
  return inlineDropdown(
    `car-status:${c.id}`,
    'status-dropdown',
    /* HTML */ `<summary class="inline-tag">${tagLabel(current.emoji, current.label)}</summary>
      <div class="inline-menu">
        ${Object.entries(CAR_STATUSES)
          .map(
            ([key, s]) => `<button
            class="inline-menu-item ${s === current ? 'selected' : ''}"
            onclick="pickCarStatus('${c.id}', '${key}')"
          >
            ${tagLabel(s.emoji, s.label)}
          </button>`,
          )
          .join('')}
      </div>`,
  );
}

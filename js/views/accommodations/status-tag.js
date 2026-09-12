function pickAccommodationStatus(id, status) {
  openInlineMenu = null;
  setAccommodationStatus(id, status);
}

function accommodationStatusTag(a) {
  const current = accStatus(a.status);
  return inlineDropdown(
    `status:${a.id}`,
    'status-dropdown',
    /* HTML */ `<summary class="inline-tag">${tagLabel(current.emoji, current.label)}</summary>
    <div class="inline-menu">
      ${Object.entries(ACCOMMODATION_STATUSES)
        .map(
          ([key, s]) => `<button
            class="inline-menu-item ${s === current ? 'selected' : ''}"
            onclick="pickAccommodationStatus('${a.id}', '${key}')"
          >
            ${tagLabel(s.emoji, s.label)}
          </button>`,
        )
        .join('')}
    </div>`,
  );
}

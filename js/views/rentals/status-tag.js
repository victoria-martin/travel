function setOfferStatus(id, status) {
  getOffer(id).status = status;
  saveNow();
  render();
}

function pickOfferStatus(id, status) {
  openInlineMenu = null;
  setOfferStatus(id, status);
}

function offerStatusTag(c) {
  const current = carStatus(c.status);
  return inlineDropdown(
    `offer-status:${c.id}`,
    'status-dropdown',
    /* HTML */ `<summary class="inline-tag">${tagLabel(current.emoji, current.label)}</summary>
      <div class="inline-menu">
        ${openResourceMenuItem(`openOfferSheet('${c.id}')`)}
        ${Object.entries(CAR_STATUSES)
          .map(
            ([key, s]) => `<button
            class="inline-menu-item ${s === current ? 'selected' : ''}"
            onclick="pickOfferStatus('${c.id}', '${key}')"
          >
            ${tagLabel(s.emoji, s.label)}
          </button>`,
          )
          .join('')}
      </div>`,
  );
}

function pickAccommodationType(id, type) {
  openInlineMenu = null;
  setAccommodationType(id, type);
}

function askNewAccommodationType(id) {
  openInlineMenu = null;
  askNewWord('accommodationTypes', (word) => setAccommodationType(id, word.key));
}

function accommodationTypeDropdown(a) {
  const current = accType(a.type);
  return inlineDropdown(
    `type:${a.id}`,
    'type-dropdown',
    /* HTML */ `<summary class="inline-tag">${tagLabel(current.emoji, current.label)}</summary>
      <div class="inline-menu">
        ${openResourceMenuItem(`openAccommodationSheet('${a.id}')`)}
        ${Object.entries(ACCOMMODATION_TYPES)
          .map(
            ([key, t]) => `<button
            class="inline-menu-item ${t === current ? 'selected' : ''}"
            onclick="pickAccommodationType('${a.id}', '${key}')"
          >
            ${tagLabel(t.emoji, t.label)}
          </button>`,
          )
          .join('')}
        <button class="inline-menu-item" onclick="askNewAccommodationType('${a.id}')">
          ＋ Ajouter un type
        </button>
      </div>`,
  );
}

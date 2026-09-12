// A closed palette: an accent colour has to hold up next to the rest of the app.
const TRAVEL_ACCENTS = ['#35607d', '#c98a3e', '#a6462e', '#7c8b5e', '#3e6259', '#6b5b95'];

// Suggestions only: the field below them takes any pasted emoji.
const TRAVEL_EMOJIS = [
  ['🌵', '🪴', '🌴', '🎄'],
  ['🪩', '💒', '🎡', '🏕️', '🏜️', '🏟️'],
  ['🏎️', '🏍️', '🚲', '🛤️'],
  ['🧗‍♀️', '🏇', '⛷️', '🚣‍♀️', '🚴‍♀️'],
];

function emptyTravel() {
  return {
    id: null,
    name: '',
    emoji: '🧳',
    image: '',
    description: '',
    status: DEFAULT_TRAVEL_STATUS,
    startDate: '',
    endDate: '',
    country: '',
    region: '',
    accentColor: '',
    travelers: 0,
  };
}

function travelForm(p) {
  return /* HTML */ `
    <div class="travel-modal-header">
      ${travelEmojiPicker(p)}
      <div>
        <h3>
          <span
            class="editable"
            id="travel-name"
            contenteditable="true"
            data-placeholder="Nouveau voyage"
            onkeydown="commitOnEnter(event)"
            >${escapeHtml(p.name)}</span
          >
        </h3>
        ${travelHeaderPlace(p)}
      </div>
    </div>
    <div class="field-row">
      <div class="field">
        <label>Pays</label
        ><input
          id="travel-country"
          type="text"
          value="${escapeHtml(p.country)}"
          placeholder="Italie"
        />
      </div>
      <div class="field">
        <label>Région</label
        ><input
          id="travel-region"
          type="text"
          value="${escapeHtml(p.region)}"
          placeholder="Toscane"
        />
      </div>
    </div>
    <div class="field-row">
      <div class="field">
        <label>Début</label><input id="travel-start" type="date" value="${p.startDate || ''}" />
      </div>
      <div class="field">
        <label>Fin</label><input id="travel-end" type="date" value="${p.endDate || ''}" />
      </div>
    </div>
    <div class="field-row">
      <div class="field">
        <label>Statut</label>
        <select id="travel-status">
          ${Object.keys(TRAVEL_STATUSES)
            .map(
              (key) =>
                `<option value="${key}" ${p.status === key ? 'selected' : ''}>${TRAVEL_STATUSES[key].emoji} ${TRAVEL_STATUSES[key].label}</option>`,
            )
            .join('')}
        </select>
      </div>
      <div class="field">
        <label>Voyageurs</label
        ><input id="travel-travelers" type="number" min="0" value="${p.travelers || 0}" />
      </div>
    </div>
    <div class="field">
      <label>Couleur d'accent</label>
      <div class="accent-swatches">
        <button
          type="button"
          class="accent-swatch accent-none ${p.accentColor ? '' : 'selected'}"
          data-accent=""
          onclick="pickTravelAccent('')"
          title="Aucune couleur"
        >
          —
        </button>
        ${TRAVEL_ACCENTS.map(
          (color) =>
            `<button type="button" class="accent-swatch ${p.accentColor === color ? 'selected' : ''}" data-accent="${color}" style="background:${color};" onclick="pickTravelAccent('${color}')" title="${color}"></button>`,
        ).join('')}
      </div>
      <input id="travel-accent" type="hidden" value="${escapeHtml(p.accentColor)}" />
    </div>
    <div class="field">
      <label>Image</label
      ><input
        id="travel-image"
        type="text"
        value="${escapeHtml(p.image)}"
        placeholder="https://…"
      />
    </div>
    <div class="field">
      <label>Description</label
      ><textarea id="travel-description" rows="2">${escapeHtml(p.description)}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" onclick="saveTravel('${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}

function travelEmojiPicker(p) {
  return /* HTML */ `<div class="emoji-picker">
    <button
      type="button"
      class="travel-modal-badge"
      id="travel-modal-badge"
      onclick="toggleTravelEmojiMenu()"
      title="Changer l'emoji"
    >
      ${escapeHtml(p.emoji)}
    </button>
    <div class="emoji-menu" id="travel-emoji-menu" hidden>
      ${TRAVEL_EMOJIS.map(
        (row) =>
          `<div class="emoji-row">${row
            .map(
              (emoji) =>
                `<button type="button" class="emoji-option ${p.emoji === emoji ? 'selected' : ''}" data-emoji="${emoji}" onclick="pickTravelEmoji('${emoji}')">${emoji}</button>`,
            )
            .join('')}</div>`,
      ).join('')}
      <input
        id="travel-emoji"
        type="text"
        value="${escapeHtml(p.emoji)}"
        maxlength="4"
        placeholder="Colle un emoji"
        oninput="paintTravelEmoji()"
      />
    </div>
  </div>`;
}

function toggleTravelEmojiMenu() {
  const menu = document.getElementById('travel-emoji-menu');
  menu.hidden = !menu.hidden;
}

function pickTravelEmoji(emoji) {
  document.getElementById('travel-emoji').value = emoji;
  paintTravelEmoji();
  document.getElementById('travel-emoji-menu').hidden = true;
}

// The field is the value: the suggestions only fill it, so a pasted emoji always wins.
function paintTravelEmoji() {
  const emoji = document.getElementById('travel-emoji').value.trim();
  document.getElementById('travel-modal-badge').textContent = emoji || '🧳';
  document
    .querySelectorAll('.emoji-option')
    .forEach((el) => el.classList.toggle('selected', el.dataset.emoji === emoji));
}

// The destination doubles as a subtitle only once it is filled in.
function travelHeaderPlace(p) {
  const place = [p.country, p.region].filter(Boolean).join(' · ');
  return place ? `<p class="travel-modal-place">${escapeHtml(place)}</p>` : '';
}

/*
  The whole card takes the accent: the emoji badge, a tinted paper and border, and the two theme
  greens so the Enregistrer button shows the colour before it is saved.
*/
function paintTravelModal(color) {
  const card = document.querySelector('.overlay .modal');
  const badge = document.getElementById('travel-modal-badge');
  badge.style.background = color ? mixAccent(color, 16, '#fff') : '';
  badge.style.borderColor = color || '';
  card.style.background = color ? mixAccent(color, 10, 'var(--paper-raised)') : '';
  card.style.borderColor = color ? mixAccent(color, 35, 'var(--line)') : '';
  ['--stone', '--stone-dark'].forEach((name) => card.style.removeProperty(name));
  if (!color) return;
  card.style.setProperty('--stone', color);
  card.style.setProperty('--stone-dark', mixAccent(color, 76, '#000'));
}

function mixAccent(color, percent, over) {
  return `color-mix(in srgb, ${color} ${percent}%, ${over})`;
}

// Clicking does not re-render the modal: it is built from modal.payload, which would drop
// whatever the other fields already hold.
function pickTravelAccent(color) {
  document.getElementById('travel-accent').value = color;
  paintTravelModal(color);
  document
    .querySelectorAll('.accent-swatch')
    .forEach((el) => el.classList.toggle('selected', el.dataset.accent === color));
}

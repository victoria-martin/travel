// A closed palette: an accent colour has to hold up next to the rest of the app.
const TRAVEL_ACCENTS = ['#35607d', '#c98a3e', '#a6462e', '#7c8b5e', '#3e6259', '#6b5b95'];

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
    <h3>${p.id ? 'Modifier' : 'Nouveau'} voyage</h3>
    <div class="field-row">
      <div class="field" style="flex:0 0 90px;">
        <label>Emoji</label
        ><input id="travel-emoji" type="text" value="${escapeHtml(p.emoji)}" maxlength="4" />
      </div>
      <div class="field">
        <label>Nom</label
        ><input id="travel-name" type="text" value="${escapeHtml(p.name)}" placeholder="Toscane" />
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
      <button class="btn btn-ghost" onclick="closeModal()">Annuler</button>
      <button class="btn" onclick="saveTravel('${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}

// Clicking does not re-render the modal: it is built from modal.payload, which would drop
// whatever the other fields already hold.
function pickTravelAccent(color) {
  document.getElementById('travel-accent').value = color;
  document
    .querySelectorAll('.accent-swatch')
    .forEach((el) => el.classList.toggle('selected', el.dataset.accent === color));
}

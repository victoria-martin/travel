function emptyProvider() {
  return {
    id: null,
    mode: '',
    name: '',
    logo: '',
    site: '',
    bookingUrl: '',
    notes: '',
    options: [],
    modelIds: [],
  };
}

function providerForm(p) {
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} un loueur ou une compagnie</h3>
    <div class="field-row">
      <div class="field">
        <label>Mode</label>
        <select id="prov-mode" onchange="repaintProviderModels()">
          <option value="" ${p.mode ? '' : 'selected'}>
            ${UNSET_TRANSPORT_MODE.emoji} ${UNSET_TRANSPORT_MODE.label}
          </option>
          ${Object.entries(TRANSPORT_MODES)
            .map(
              ([key, m]) =>
                `<option value="${key}" ${p.mode === key ? 'selected' : ''}>${m.emoji} ${m.label}</option>`,
            )
            .join('')}
        </select>
      </div>
      <div class="field">
        <label>Nom</label
        ><input id="prov-name" type="text" value="${escapeHtml(p.name)}" placeholder="Hertz" />
      </div>
    </div>
    <div class="field">
      <label>Logo (url d'image)</label
      ><input id="prov-logo" type="text" value="${escapeHtml(p.logo)}" placeholder="https://..." />
    </div>
    <div class="field-row">
      <div class="field">
        <label>Site</label
        ><input
          id="prov-site"
          type="text"
          value="${escapeHtml(p.site)}"
          placeholder="https://..."
        />
      </div>
      <div class="field">
        <label>Réservation</label
        ><input id="prov-booking" type="text" value="${escapeHtml(p.bookingUrl)}" />
      </div>
    </div>
    ${providerOptionsField(p)} ${providerModelsField(p)}
    <div class="field">
      <label>Notes</label><textarea id="prov-notes" rows="2">${escapeHtml(p.notes)}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="saveProvider('${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}

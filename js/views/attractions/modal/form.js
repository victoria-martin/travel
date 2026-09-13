function emptyAttraction() {
  return {
    id: null,
    name: '',
    type: '',
    status: '',
    description: '',
    geoAddress: '',
    city: '',
    county: '',
    region: '',
    lat: '',
    lng: '',
    link: '',
    hours: '',
    phone: '',
    budget: '',
    amountMin: '',
    amountMax: '',
    tags: [],
    favorite: false,
  };
}

function attractionForm(p) {
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} une activité</h3>
    <div class="field-row">
      <div class="field">
        <label>Type</label>
        <select id="a-type">
          <option value="" ${p.type ? '' : 'selected'}>
            ${UNSET_ATTRACTION_TYPE.emoji} ${UNSET_ATTRACTION_TYPE.label}
          </option>
          ${Object.entries(ATTRACTION_TYPES)
            .map(
              ([key, t]) =>
                `<option value="${key}" ${p.type === key ? 'selected' : ''}>${t.emoji} ${t.label}</option>`,
            )
            .join('')}
        </select>
      </div>
      <div class="field">
        <label>Nom</label
        ><input
          id="a-name"
          type="text"
          value="${escapeHtml(p.name)}"
          placeholder="Torre del Palacio Guinigi"
        />
      </div>
    </div>
    <div class="field">
      <label>Statut</label>
      <select id="a-status">
        <option value="" ${p.status ? '' : 'selected'}>
          ${UNSET_ATTRACTION_STATUS.emoji} ${UNSET_ATTRACTION_STATUS.label}
        </option>
        ${Object.entries(ATTRACTION_STATUSES)
          .map(
            ([key, s]) =>
              `<option value="${key}" ${p.status === key ? 'selected' : ''}>${s.emoji} ${s.label}</option>`,
          )
          .join('')}
      </select>
    </div>
    ${locateFields(p)}
    <div class="field-row">
      <div class="field">
        <label>Budget</label
        ><input id="a-budget" type="text" value="${escapeHtml(p.budget)}" placeholder="25" />
      </div>
      <div class="field">
        <label>Prix mini</label
        ><input id="a-amount-min" type="text" value="${escapeHtml(p.amountMin)}" />
      </div>
      <div class="field">
        <label>Prix maxi</label
        ><input id="a-amount-max" type="text" value="${escapeHtml(p.amountMax)}" />
      </div>
    </div>
    <div class="field">
      <label>Lien</label
      ><input id="a-link" type="text" value="${escapeHtml(p.link)}" placeholder="https://..." />
    </div>
    <div class="field-row">
      <div class="field">
        <label>Horaires</label
        ><input
          id="a-hours"
          type="text"
          value="${escapeHtml(p.hours)}"
          placeholder="mar.-dim. 12h-15h"
        />
      </div>
      <div class="field">
        <label>Téléphone</label
        ><input
          id="a-phone"
          type="text"
          value="${escapeHtml(p.phone)}"
          placeholder="338 119 52 75"
        />
      </div>
    </div>
    ${tagsField(p, allAttractionTags)}
    <div class="field">
      <label>Description</label
      ><textarea id="a-description" rows="3">${escapeHtml(p.description)}</textarea>
    </div>
    <label class="filter-option" style="padding:0 0 6px 0;"
      ><input type="checkbox" id="a-favorite" ${p.favorite ? 'checked' : ''} /> ⭐ Coup de
      cœur</label
    >
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="saveAttraction('${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}

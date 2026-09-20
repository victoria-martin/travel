function emptyAttraction() {
  return {
    id: null,
    name: '',
    type: '',
    status: 'toSort',
    description: '',
    address: '',
    ...emptyPlaceLevels(),
    lat: '',
    lng: '',
    accommodationId: '',
    mapsLink: '',
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
  wordSelectValues['a-type'] = p.type || '';
  wordSelectValues['a-status'] = p.status || '';
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} un lieu</h3>
    <div class="field-row">
      <div class="field">
        <label>Type</label>
        <select id="a-type" onchange="wordSelectChanged('a-type', 'attractionTypes')">
          <option value="" ${p.type ? '' : 'selected'}>
            ${UNSET_ATTRACTION_TYPE.emoji} ${UNSET_ATTRACTION_TYPE.label}
          </option>
          ${Object.entries(ATTRACTION_TYPES)
            .map(
              ([key, t]) =>
                `<option value="${key}" ${p.type === key ? 'selected' : ''}>${t.emoji} ${t.label}</option>`,
            )
            .join('')}
          <option value="${NEW_WORD_VALUE}">＋ Ajouter un type</option>
        </select>
      </div>
      <div class="field">
        <label>Statut</label>
        <select id="a-status" onchange="wordSelectChanged('a-status', 'attractionStatuses')">
          <option value="" ${p.status ? '' : 'selected'}>
            ${UNSET_ATTRACTION_STATUS.emoji} ${UNSET_ATTRACTION_STATUS.label}
          </option>
          ${Object.entries(ATTRACTION_STATUSES)
            .map(
              ([key, s]) =>
                `<option value="${key}" ${p.status === key ? 'selected' : ''}>${s.emoji} ${s.label}</option>`,
            )
            .join('')}
          <option value="${NEW_WORD_VALUE}">＋ Ajouter un statut</option>
        </select>
      </div>
    </div>
    <div class="field">
      <label>Nom</label
      ><input
        id="a-name"
        type="text"
        value="${escapeHtml(p.name)}"
      />
    </div>
    <div class="field">
      <label>Description</label
      ><textarea id="a-description" rows="3">${escapeHtml(p.description)}</textarea>
    </div>
    ${locateFields(p)}
    <div class="field">
      <label>Hébergement</label>
      <select id="a-accommodation">
        <option value="" ${p.accommodationId ? '' : 'selected'}>Aucun</option>
        ${attractionAccommodations()
          .map(
            (a) =>
              `<option value="${a.id}" ${p.accommodationId === a.id ? 'selected' : ''}>${accType(a.type).emoji} ${escapeHtml(a.name)}</option>`,
          )
          .join('')}
      </select>
    </div>
    <div class="field-row">
      <div class="field">
        <label>Budget</label
        ><input id="a-budget" type="text" value="${escapeHtml(p.budget)}" />
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
      <label>Lien Google Maps</label
      ><input
        id="a-maps-link"
        type="text"
        value="${escapeHtml(p.mapsLink)}"
        placeholder="https://..."
        onpaste="importGoogleMapsPaste(this, 'a-name')"
        onchange="importGoogleMapsLink(this, 'a-name')"
      />
    </div>
    <div class="field">
      <label>Lien</label
      ><input id="a-link" type="text" value="${escapeHtml(p.link)}" placeholder="https://..." />
    </div>
    <div class="field-row">
      <div class="field">
        <label>Horaires</label
        ><input id="a-hours" type="text" value="${escapeHtml(p.hours)}" />
        <small class="field-hint">ex. Mar.-dim. 12h-15h</small>
      </div>
      <div class="field">
        <label>Téléphone</label
        ><input id="a-phone" type="text" value="${escapeHtml(p.phone)}" />
      </div>
    </div>
    ${tagsField(p, { field: 'tags', label: 'Tags', options: allAttractionTags })}
    <label class="filter-option" style="padding:0 0 6px 0;"
      ><input type="checkbox" id="a-favorite" ${p.favorite ? 'checked' : ''} />
      ${svgIcon('star', { fill: true })} Coup de cœur</label
    >
    ${attractionScenarioActions()}
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="saveAttraction('${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}

function attractionAccommodations() {
  return ofCurrentTravel(state.accommodations).sort(
    (a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0) || a.name.localeCompare(b.name),
  );
}

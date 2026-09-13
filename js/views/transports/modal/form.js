function emptyTransport() {
  return {
    id: null,
    mode: '',
    status: '',
    fromCityId: '',
    fromPrecision: '',
    toCityId: '',
    toPrecision: '',
    departDate: '',
    departTime: '',
    arriveDate: '',
    arriveTime: '',
    carrier: '',
    reference: '',
    carId: '',
    budget: '',
    amountMin: '',
    amountMax: '',
    link: '',
    notes: '',
    favorite: false,
  };
}

function transportCityOptions(selected) {
  const cities = ofCurrentTravel(state.cities).sort((a, b) => a.name.localeCompare(b.name));
  return /* HTML */ `<option value="" ${selected ? '' : 'selected'}>Aucune ville</option>
    ${cities
      .map(
        (c) =>
          `<option value="${c.id}" ${selected === c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`,
      )
      .join('')}`;
}

function transportEndpointFields(side, label, cityId, precision) {
  return /* HTML */ `<div class="field-row">
    <div class="field">
      <label>${label}</label>
      <select id="t-${side}-city">
        ${transportCityOptions(cityId)}
      </select>
    </div>
    <div class="field">
      <label>Précision</label
      ><input
        id="t-${side}-precision"
        type="text"
        value="${escapeHtml(precision)}"
        placeholder="Aéroport de Pise"
      />
    </div>
  </div>`;
}

function transportScheduleFields(side, label, date, time) {
  return /* HTML */ `<div class="field-row">
    <div class="field">
      <label>${label}</label><input id="t-${side}-date" type="date" value="${escapeHtml(date)}" />
    </div>
    <div class="field">
      <label>Heure</label><input id="t-${side}-time" type="time" value="${escapeHtml(time)}" />
    </div>
  </div>`;
}

// Une voiture référence une location, les autres modes portent leur compagnie : deux blocs
// exclusifs, repeints quand le mode change.
function transportCarrierFields(p) {
  if (p.mode === 'car') {
    const cars = ofCurrentTravel(state.cars).sort((a, b) => a.name.localeCompare(b.name));
    return /* HTML */ `<div class="field">
      <label>Loueur</label>
      <select id="t-car">
        <option value="" ${p.carId ? '' : 'selected'}>Aucune voiture</option>
        ${cars
          .map(
            (c) =>
              `<option value="${c.id}" ${p.carId === c.id ? 'selected' : ''}>${escapeHtml(transportCarLabel(c))}</option>`,
          )
          .join('')}
      </select>
    </div>`;
  }
  return /* HTML */ `<div class="field-row">
    <div class="field">
      <label>Compagnie</label
      ><input
        id="t-carrier"
        type="text"
        value="${escapeHtml(p.carrier)}"
        placeholder="Trenitalia"
      />
    </div>
    <div class="field">
      <label>Numéro / référence</label
      ><input id="t-reference" type="text" value="${escapeHtml(p.reference)}" />
    </div>
  </div>`;
}

function repaintTransportCarrierFields() {
  modal.payload.mode = document.getElementById('t-mode').value;
  document.getElementById('t-carrier-block').innerHTML = transportCarrierFields(modal.payload);
}

function transportPriceFields(p) {
  return /* HTML */ `<div class="field-row">
    <div class="field">
      <label>Budget</label
      ><input id="t-budget" type="text" value="${escapeHtml(p.budget)}" placeholder="150" />
    </div>
    <div class="field">
      <label>Prix mini</label
      ><input id="t-amount-min" type="text" value="${escapeHtml(p.amountMin)}" />
    </div>
    <div class="field">
      <label>Prix maxi</label
      ><input id="t-amount-max" type="text" value="${escapeHtml(p.amountMax)}" />
    </div>
  </div>`;
}

function transportForm(p) {
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} un transport</h3>
    <div class="field-row">
      <div class="field">
        <label>Mode</label>
        <select id="t-mode" onchange="repaintTransportCarrierFields()">
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
        <label>Statut</label>
        <select id="t-status">
          <option value="" ${p.status ? '' : 'selected'}>
            ${UNSET_TRANSPORT_STATUS.emoji} ${UNSET_TRANSPORT_STATUS.label}
          </option>
          ${Object.entries(TRANSPORT_STATUSES)
            .map(
              ([key, s]) =>
                `<option value="${key}" ${p.status === key ? 'selected' : ''}>${s.emoji} ${s.label}</option>`,
            )
            .join('')}
        </select>
      </div>
    </div>
    ${transportEndpointFields('from', 'Départ', p.fromCityId, p.fromPrecision)}
    ${transportEndpointFields('to', 'Arrivée', p.toCityId, p.toPrecision)}
    ${transportScheduleFields('depart', 'Part le', p.departDate, p.departTime)}
    ${transportScheduleFields('arrive', 'Arrive le', p.arriveDate, p.arriveTime)}
    <div id="t-carrier-block">${transportCarrierFields(p)}</div>
    ${transportPriceFields(p)}
    <div class="field">
      <label>Lien</label
      ><input id="t-link" type="text" value="${escapeHtml(p.link)}" placeholder="https://..." />
    </div>
    <div class="field">
      <label>Notes</label><textarea id="t-notes" rows="2">${escapeHtml(p.notes)}</textarea>
    </div>
    <label class="filter-option" style="padding:0 0 6px 0;"
      ><input type="checkbox" id="t-favorite" ${p.favorite ? 'checked' : ''} /> ⭐ Coup de
      cœur</label
    >
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="saveTransport('${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}

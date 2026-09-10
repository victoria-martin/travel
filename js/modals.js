function setListMode(kind, mode) {
  listViewMode[kind] = mode;
  render();
}

function openModal(type, a, b) {
  if (type === 'accommodation') {
    modal = {
      type,
      payload: a
        ? { ...getAccommodation(a) }
        : {
            id: null,
            type: DEFAULT_ACCOMMODATION_TYPE,
            name: '',
            address: '',
            city: '',
            county: '',
            region: '',
            lat: '',
            lng: '',
            price: '',
            dates: '',
            link: '',
            notes: '',
            favorite: false,
          },
    };
  } else if (type === 'voitures' || type === 'charges') {
    const cfg = SIMPLE_CONFIG[type];
    const existing = a ? state[cfg.dataKey].find((x) => x.id === a) : null;
    const empty = { id: null };
    cfg.fields.forEach((f) => (empty[f.key] = ''));
    modal = { type, payload: existing ? { ...existing } : empty };
  } else if (type === 'step') {
    const scenarioId = a;
    const stepId = b;
    const s = getScenario(scenarioId);
    const existing = stepId ? s.steps.find((x) => x.id === stepId) : null;
    modal = {
      type,
      scenarioId,
      payload: existing
        ? { ...existing }
        : {
            id: null,
            city: '',
            region: '',
            arrivalDate: '',
            nights: 1,
            accommodationId: null,
            notes: '',
          },
    };
  }
  render();
}

function openPasteImport() {
  modal = { type: 'paste-import', payload: { text: '' } };
  render();
}

function closeModal() {
  modal = null;
  render();
}

function renderModal() {
  const container = document.createElement('div');
  container.className = 'overlay';
  container.onclick = (e) => {
    if (e.target === container) closeModal();
  };

  let bodyHtml = '';
  if (modal.type === 'accommodation') bodyHtml = accommodationForm(modal.payload);
  else if (modal.type === 'voitures' || modal.type === 'charges')
    bodyHtml = simpleForm(modal.type, modal.payload);
  else if (modal.type === 'step') bodyHtml = stepForm(modal.payload);
  else if (modal.type === 'paste-import') bodyHtml = pasteImportForm();
  else if (modal.type === 'sync') bodyHtml = syncForm();

  container.innerHTML = `<div class="modal" style="${modal.type === 'paste-import' ? 'max-width:640px;' : ''}">${bodyHtml}</div>`;
  document.getElementById('app').appendChild(container);
}

function pasteImportForm() {
  return /* HTML */ `
    <h3>Importer depuis un tableau</h3>
    <p style="font-size:13px; color:var(--ink-soft); margin-top:-8px;">
      Dans Google Sheets ou Excel, mets tes colonnes dans cet ordre (une ligne par hébergement) :
      <br /><strong>Type · Nom · Ville · Région · Prix · Dates · Lien · Notes</strong><br />
      Type accepte
      ${Object.values(ACCOMMODATION_TYPES)
        .map((t) => `"${t.label}"`)
        .join(', ')}
      (par défaut : ${accType(DEFAULT_ACCOMMODATION_TYPE).label.toLowerCase()}). Sélectionne tes
      lignes, copie (Ctrl+C), puis colle ci-dessous.
    </p>
    <div class="field">
      <textarea
        id="paste-area"
        rows="10"
        placeholder="hotel	Antico Casale	Sarzana	Ligurie	152	21/09	https://...	Super, pack remboursable"
        style="font-family:monospace; font-size:12px;"
      ></textarea>
    </div>
    <div id="paste-preview" style="font-size:12.5px; color:var(--ink-soft);"></div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Annuler</button>
      <button class="btn" onclick="runPasteImport()">Analyser et importer</button>
    </div>
  `;
}

function runPasteImport() {
  const raw = document.getElementById('paste-area').value;
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length === 0) {
    alert("Colle d'abord au moins une ligne.");
    return;
  }
  let added = 0;
  lines.forEach((line) => {
    const cells = line.split('\t').length > 1 ? line.split('\t') : line.split(',');
    const [typeRaw, name, city, region, price, dates, link, notes] = cells.map((c) =>
      (c || '').trim(),
    );
    if (!name && !city) return;
    const type = accTypeFromText(typeRaw);
    state.accommodations.push({
      id: uid(),
      type,
      name: name || city || 'Sans nom',
      address: '',
      city: city || '',
      county: region || '',
      region: '',
      lat: '',
      lng: '',
      price: price || '',
      dates: dates || '',
      link: link || '',
      notes: notes || '',
      favorite: false,
    });
    added++;
  });
  saveNow();
  closeModal();
  alert(added + ' hébergement(s) importé(s). Renseigne une adresse pour les placer sur la carte.');
  render();
}

function accommodationForm(p) {
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} un hébergement</h3>
    <div class="field-row">
      <div class="field">
        <label>Type</label>
        <select id="f-type">
          ${Object.entries(ACCOMMODATION_TYPES)
            .map(
              ([key, t]) =>
                `<option value="${key}" ${p.type === key ? 'selected' : ''}>${t.label}</option>`,
            )
            .join('')}
        </select>
      </div>
      <div class="field">
        <label>Nom</label
        ><input id="f-name" type="text" value="${escapeHtml(p.name)}" placeholder="Antico Casale" />
      </div>
    </div>
    <div class="field">
      <label>Adresse</label
      ><input
        id="f-address"
        type="text"
        value="${escapeHtml(p.address)}"
        placeholder="Borgo La Torre alle Tolfe, Siena"
      />
    </div>
    <div id="geocode-status" class="geocode-status">${geocodeSummary(p)}</div>
    <div class="field-row">
      <div class="field">
        <label>Prix</label
        ><input id="f-price" type="text" value="${escapeHtml(p.price)}" placeholder="120" />
      </div>
      <div class="field">
        <label>Dates</label
        ><input id="f-dates" type="text" value="${escapeHtml(p.dates)}" placeholder="12–14 juin" />
      </div>
    </div>
    <div class="field">
      <label>Lien</label
      ><input id="f-link" type="text" value="${escapeHtml(p.link)}" placeholder="https://..." />
    </div>
    <div class="field">
      <label>Notes</label><textarea id="f-notes" rows="2">${escapeHtml(p.notes)}</textarea>
    </div>
    <label class="filter-option" style="padding:0 0 6px 0;"
      ><input type="checkbox" id="f-favorite" ${p.favorite ? 'checked' : ''} /> ⭐ Coup de
      cœur</label
    >
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="saveAccommodation('${p.id || ''}')">
        Enregistrer
      </button>
    </div>
  `;
}

function geocodeSummary(p) {
  if (!p.address) return "Ville, province et région sont déduites de l'adresse.";
  if (!p.lat || !p.lng) return '⚠️ Adresse non localisée — aucun point sur la carte.';
  return `📍 ${[p.city, p.county, p.region].filter(Boolean).join(' · ')}`;
}

async function saveAccommodation(id) {
  const previous = id ? getAccommodation(id) : null;
  const address = document.getElementById('f-address').value.trim();
  const item = {
    id: id || uid(),
    type: document.getElementById('f-type').value,
    name: document.getElementById('f-name').value.trim() || 'Sans nom',
    address,
    city: previous ? previous.city : '',
    county: previous ? previous.county : '',
    region: previous ? previous.region : '',
    lat: previous ? previous.lat : '',
    lng: previous ? previous.lng : '',
    price: document.getElementById('f-price').value.trim(),
    dates: document.getElementById('f-dates').value.trim(),
    link: document.getElementById('f-link').value.trim(),
    notes: document.getElementById('f-notes').value.trim(),
    favorite: document.getElementById('f-favorite').checked,
  };

  const needsGeocoding = address && (!previous || previous.address !== address || !previous.lat);
  if (needsGeocoding) {
    setGeocodeStatus("⏳ Localisation de l'adresse…", true);
    const found = await geocodeAddress(address);
    if (found) Object.assign(item, found);
    else {
      Object.assign(item, { lat: '', lng: '', city: '', county: '', region: '' });
      setGeocodeStatus('⚠️ Adresse introuvable — enregistrée sans position.', false);
    }
  } else if (!address) {
    Object.assign(item, { lat: '', lng: '', city: '', county: '', region: '' });
  }

  if (id) {
    const idx = state.accommodations.findIndex((a) => a.id === id);
    state.accommodations[idx] = item;
  } else {
    state.accommodations.push(item);
  }
  saveNow();
  closeModal();
}

function setGeocodeStatus(message, busy) {
  const status = document.getElementById('geocode-status');
  if (status) status.textContent = message;
  const button = document.getElementById('f-save');
  if (button) button.disabled = !!busy;
}

function simpleForm(kind, p) {
  const cfg = SIMPLE_CONFIG[kind];
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} — ${cfg.title}</h3>
    ${cfg.fields
      .map((f) =>
        f.type === 'textarea'
          ? `<div class="field"><label>${f.label}</label><textarea id="f-${f.key}" rows="2">${escapeHtml(p[f.key])}</textarea></div>`
          : `<div class="field"><label>${f.label}</label><input id="f-${f.key}" type="text" value="${escapeHtml(p[f.key])}"></div>`,
      )
      .join('')}
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Annuler</button>
      <button class="btn" onclick="saveSimple('${kind}','${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}

function saveSimple(kind, id) {
  const cfg = SIMPLE_CONFIG[kind];
  const item = { id: id || uid() };
  cfg.fields.forEach((f) => {
    item[f.key] = document.getElementById('f-' + f.key).value.trim();
  });
  const arr = state[cfg.dataKey];
  if (id) {
    const idx = arr.findIndex((x) => x.id === id);
    arr[idx] = item;
  } else {
    arr.push(item);
  }
  saveNow();
  closeModal();
}

function stepForm(p) {
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} une étape</h3>
    <div class="field">
      <label>Ville</label
      ><input id="s-city" type="text" value="${escapeHtml(p.city)}" placeholder="Sienne" />
    </div>
    <div class="field-row">
      <div class="field">
        <label>Région</label><input id="s-region" type="text" value="${escapeHtml(p.region)}" />
      </div>
      <div class="field">
        <label>Nuits</label><input id="s-nights" type="number" min="0" value="${p.nights || 0}" />
      </div>
    </div>
    <div class="field">
      <label>Date d'arrivée</label
      ><input id="s-date" type="text" value="${escapeHtml(p.arrivalDate)}" placeholder="12 juin" />
    </div>
    <div class="field">
      <label>Notes</label><textarea id="s-notes" rows="2">${escapeHtml(p.notes)}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Annuler</button>
      <button class="btn" onclick="saveStep('${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}

function saveStep(id) {
  const s = getScenario(modal.scenarioId);
  const item = {
    id: id || uid(),
    city: document.getElementById('s-city').value.trim(),
    region: document.getElementById('s-region').value.trim(),
    nights: parseInt(document.getElementById('s-nights').value) || 0,
    arrivalDate: document.getElementById('s-date').value.trim(),
    notes: document.getElementById('s-notes').value.trim(),
    accommodationId: id ? s.steps.find((x) => x.id === id).accommodationId || null : null,
  };
  if (id) {
    const idx = s.steps.findIndex((x) => x.id === id);
    s.steps[idx] = item;
  } else {
    s.steps.push(item);
  }
  saveNow();
  closeModal();
}

function deleteItem(dataKey, id) {
  if (!confirm('Supprimer cet élément ?')) return;
  state[dataKey] = state[dataKey].filter((x) => x.id !== id);
  saveNow();
  render();
}

function emptyState(title, sub) {
  return `<div class="empty-state"><strong>${title}</strong>${sub}</div>`;
}

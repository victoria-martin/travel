/*
  Chaque type de modale déclare comment construire son payload à l'ouverture et comment
  rendre son corps ; les formulaires eux-mêmes vivent dans le dossier de leur vue.
*/

let modal = null; // {type, payload}
let modalSnapshot = null; // field values as opened, to tell whether anything was typed

const MODAL_TYPES = {
  voyage: {
    open: (id) => ({ payload: id ? { ...getTravel(id) } : emptyTravel() }),
    body: (m) => travelForm(m.payload),
    after: (m) => paintTravelModal(m.payload.accentColor),
    edits: true,
  },
  accommodation: {
    open: (id) => ({ payload: id ? { ...getAccommodation(id) } : emptyAccommodation() }),
    body: (m) => accommodationForm(m.payload),
    edits: true,
  },
  ville: {
    open: (id) => ({ payload: id ? { ...getCity(id) } : emptyCity() }),
    body: (m) => cityForm(m.payload),
    edits: true,
  },
  attraction: {
    open: (id) => ({ payload: id ? { ...getAttraction(id) } : emptyAttraction() }),
    body: (m) => attractionForm(m.payload),
    edits: true,
  },
  voiture: {
    open: (id) => ({ payload: id ? { ...getCar(id) } : emptyCar() }),
    body: (m) => carForm(m.payload),
    edits: true,
  },
  charge: {
    open: (id) => ({ payload: id ? { ...getFixedCost(id) } : emptyFixedCost() }),
    body: (m) => fixedCostForm(m.payload),
    edits: true,
  },
  step: {
    open: (scenarioId, stepId) => ({
      scenarioId,
      payload: stepId ? { ...getStep(scenarioId, stepId) } : emptyStep(),
    }),
    body: (m) => stepForm(m.payload),
    edits: true,
  },
  'paste-import': {
    open: () => ({ payload: { text: '' } }),
    body: () => pasteImportForm(),
    width: '640px',
    edits: true,
  },
  sync: { body: () => syncForm() },
};

function openModal(type, a, b) {
  modal = { type, ...MODAL_TYPES[type].open(a, b, type) };
  render();
}

function closeModal() {
  modal = null;
  modalSnapshot = null;
  render();
}

// User-initiated close: confirm while the typed fields are not saved.
function dismissModal() {
  if (modalIsDirty() && !confirm('Fermer sans enregistrer ? Les modifications seront perdues.')) {
    return;
  }
  closeModal();
}

function modalIsDirty() {
  return modalSnapshot !== null && modalSnapshot !== modalFieldsState();
}

function modalFieldsState() {
  const fields = document.querySelectorAll(
    '.overlay .modal input, .overlay .modal textarea, .overlay .modal select, .overlay .modal [contenteditable]',
  );
  return JSON.stringify([modal.payload, [...fields].map(modalFieldValue)]);
}

function modalFieldValue(field) {
  if (field.isContentEditable) return field.innerText;
  return field.type === 'checkbox' || field.type === 'radio' ? field.checked : field.value;
}

function renderModal() {
  const container = document.createElement('div');
  container.className = 'overlay';
  container.onclick = (e) => {
    if (e.target === container) dismissModal();
  };

  const cfg = MODAL_TYPES[modal.type];
  const style = cfg.width ? `max-width:${cfg.width};` : '';
  container.innerHTML = `<div class="modal" style="${style}">${cfg.body(modal)}</div>`;
  document.getElementById('app').appendChild(container);
  if (cfg.after) cfg.after(modal);
  modalSnapshot = cfg.edits ? modalFieldsState() : null;
}

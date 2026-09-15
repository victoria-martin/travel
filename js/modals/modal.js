/*
  Chaque type de modale déclare comment construire son payload à l'ouverture et comment
  rendre son corps ; les formulaires eux-mêmes vivent dans le dossier de leur vue.
  Le payload est un clone profond : un spread partagerait les tableaux de l'entité (tags,
  catégories, lignes d'étape), et les champs à pastilles, qui écrivent dans le payload à la frappe,
  modifieraient la donnée qu'Annuler est censé laisser intacte.
*/

let modal = null; // {type, sheet, payload}
let modalSnapshot = null; // field values as opened, to tell whether anything was typed

const MODAL_TYPES = {
  voyage: {
    open: (id) => ({ payload: id ? structuredClone(getTravel(id)) : emptyTravel() }),
    body: (m) => travelForm(m.payload),
    after: (m) => paintTravelModal(m.payload.accentColor),
    edits: true,
  },
  accommodation: {
    open: (id) => ({ payload: id ? structuredClone(getAccommodation(id)) : emptyAccommodation() }),
    body: (m) => accommodationForm(m.payload),
    edits: true,
  },
  'accommodation-booking': {
    open: () => ({ payload: emptyAccommodation() }),
    body: (m) => bookingAccommodationForm(m.payload),
    edits: true,
  },
  'accommodation-home-exchange': {
    open: () => ({ payload: { ...emptyAccommodation(), type: 'homeExchange' } }),
    body: (m) => homeExchangeAccommodationForm(m.payload),
    edits: true,
  },
  'accommodation-airbnb': {
    open: () => ({ payload: { ...emptyAccommodation(), type: 'airbnb' } }),
    body: (m) => airbnbAccommodationForm(m.payload),
    edits: true,
  },
  ville: {
    open: (id) => ({ payload: id ? structuredClone(getCity(id)) : emptyCity() }),
    body: (m) => cityForm(m.payload),
    edits: true,
  },
  attraction: {
    open: (id) => ({ payload: id ? structuredClone(getAttraction(id)) : emptyAttraction() }),
    body: (m) => attractionForm(m.payload),
    edits: true,
  },
  transport: {
    open: (id) => ({ payload: id ? structuredClone(getTransport(id)) : emptyTransport() }),
    body: (m) => transportForm(m.payload),
    edits: true,
  },
  voiture: {
    open: (id) => ({ payload: id ? structuredClone(getCar(id)) : emptyCar() }),
    body: (m) => carForm(m.payload),
    edits: true,
  },
  charge: {
    open: (id, scenarioId) => ({
      scenarioId,
      payload: id ? structuredClone(getFixedCost(id)) : emptyFixedCost(),
    }),
    body: (m) => fixedCostForm(m.payload),
    edits: true,
  },
  step: {
    // Une étape neuve naît seule ou déjà ouverte en options : c'est le bouton qui l'a dit.
    open: (scenarioId, stepId, options = 1) => ({
      scenarioId,
      options,
      payload: stepId ? structuredClone(getStep(scenarioId, stepId)) : emptyStep(),
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

// Un même formulaire se pose au centre ou en panneau de droite : c'est l'ouverture qui le dit et
// non le type, une fiche s'ouvrant en panneau là où sa création garde la modale.
function openModal(type, ...args) {
  showModal(type, false, args);
}

function openSheet(type, ...args) {
  showModal(type, true, args);
}

function showModal(type, sheet, args) {
  modal = { type, sheet, ...MODAL_TYPES[type].open(...args) };
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
  container.onclick = (e) => {
    if (e.target === container) dismissModal();
  };

  const cfg = MODAL_TYPES[modal.type];
  // Un panneau tient toute la hauteur contre le bord droit : sa largeur est la sienne.
  const style = cfg.width && !modal.sheet ? `max-width:${cfg.width};` : '';
  container.className = modal.sheet ? 'overlay overlay-sheet' : 'overlay';
  const box = modal.sheet ? 'modal modal-sheet' : 'modal';
  container.innerHTML = `<div class="${box}" style="${style}">${cfg.body(modal)}</div>`;
  document.getElementById('app').appendChild(container);
  if (cfg.after) cfg.after(modal);
  modalSnapshot = cfg.edits ? modalFieldsState() : null;
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal) dismissModal();
});

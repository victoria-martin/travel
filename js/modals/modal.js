/*
  Chaque type de modale déclare comment construire son payload à l'ouverture et comment
  rendre son corps ; les formulaires eux-mêmes vivent dans le dossier de leur vue.
  Le payload est un clone profond : un spread partagerait les tableaux de l'entité (tags,
  catégories, lignes d'étape), et les champs à pastilles, qui écrivent dans le payload à la frappe,
  modifieraient la donnée qu'Annuler est censé laisser intacte.
*/

var modal = null; // {type, sheet, payload}
var modalSnapshot = null; // field values as opened, to tell whether anything was typed

const MODAL_TYPES = {
  voyage: {
    open: (id) => ({ payload: id ? structuredClone(getTravel(id)) : emptyTravel() }),
    // body : React (src/domains/travels/modal/TravelModal.tsx, src/modal-bodies.ts).
    after: (m) => paintTravelModal(m.payload.accentColor),
    edits: true,
  },
  accommodation: {
    open: (id) => ({ payload: id ? structuredClone(getAccommodation(id)) : emptyAccommodation() }),
    // body : React (src/domains/accommodations/modal/AccommodationModal.tsx, src/modal-bodies.ts).
    edits: true,
  },
  'accommodation-booking': {
    open: () => ({ payload: emptyAccommodation() }),
    // body : React (src/domains/accommodations/modal/BookingAccommodationModal.tsx, src/modal-bodies.ts).
    edits: true,
  },
  'accommodation-home-exchange': {
    open: () => ({ payload: { ...emptyAccommodation(), type: 'homeExchange' } }),
    // body : React (src/domains/accommodations/modal/HomeExchangeAccommodationModal.tsx, src/modal-bodies.ts).
    edits: true,
  },
  'accommodation-airbnb': {
    open: () => ({ payload: { ...emptyAccommodation(), type: 'airbnb' } }),
    // body : React (src/domains/accommodations/modal/AirbnbAccommodationModal.tsx, src/modal-bodies.ts).
    edits: true,
  },
  'accommodation-google-maps': {
    open: () => ({ payload: emptyAccommodation() }),
    // body : React (src/domains/accommodations/modal/GoogleMapsAccommodationModal.tsx, src/modal-bodies.ts).
    edits: true,
  },
  attraction: {
    open: (id) => ({ payload: id ? structuredClone(getAttraction(id)) : emptyAttraction() }),
    // body : React (src/domains/attractions/modal/AttractionModal.tsx, src/modal-bodies.ts).
    edits: true,
  },
  ville: {
    open: (id) => {
      const payload = id ? structuredClone(getVille(id)) : emptyVille();
      return { payload: { ...payload, matches: [], status: villeGeocodeSummary(payload) } };
    },
    // body : React (src/domains/villes/modal/VilleModal.tsx, src/modal-bodies.ts).
    edits: true,
  },
  transport: {
    open: (id, scenarioId) => ({
      scenarioId,
      payload: id ? structuredClone(getTransport(id)) : emptyTransport(),
    }),
    // body : React (src/domains/transports/modal/TransportModal.tsx, src/modal-bodies.ts).
    edits: true,
  },
  prestataire: {
    open: (id) => ({ payload: id ? structuredClone(getProvider(id)) : emptyProvider() }),
    // body : React (src/domains/transports/modal/ProviderModal.tsx, src/modal-bodies.ts).
    edits: true,
  },
  modele: {
    open: (id) => ({ payload: id ? structuredClone(getCarModel(id)) : emptyCarModel() }),
    // body : React (src/domains/car-models/modal/CarModelModal.tsx, src/modal-bodies.ts).
    edits: true,
  },
  voiture: {
    open: (id, scenarioId) => ({
      scenarioId,
      payload: id ? structuredClone(getOffer(id)) : emptyOffer(),
    }),
    // body : React (src/domains/rentals/modal/OfferModal.tsx, src/modal-bodies.ts).
    edits: true,
  },
  charge: {
    open: (id, scenarioId) => ({
      scenarioId,
      payload: id ? structuredClone(getFixedCost(id)) : emptyFixedCost(),
    }),
    // body : React (src/domains/fixed-costs/modal/FixedCostModal.tsx, src/modal-bodies.ts).
    edits: true,
  },
  'import-expenses': {
    open: () => ({ payload: {} }),
    // body : React (src/domains/expenses/modal/ImportExpensesModal.tsx, src/modal-bodies.ts).
    width: '860px',
  },
  'actual-expense': {
    open: (id) => ({
      payload: id ? structuredClone(getActualExpense(id)) : emptyActualExpense(),
    }),
    // body : React (src/domains/expenses/modal/ActualExpenseModal.tsx, src/modal-bodies.ts) —
    // premier type de modale porté, open/edits restent ici.
    edits: true,
  },
  'valise-catalogue': {
    open: (id) => ({ payload: id ? structuredClone(getPackingItem(id)) : emptyPackingItem() }),
    // body : React (src/domains/packing/modal/PackingItemModal.tsx, src/modal-bodies.ts).
    edits: true,
  },
  'valise-composer': {
    open: () => ({ payload: {} }),
    // body : React (src/domains/packing/modal/PackingComposerModal.tsx, src/modal-bodies.ts).
  },
  'scenario-panel': {
    open: (scenarioId, key) => ({ scenarioId, payload: { scenarioId, key } }),
    // body : React (src/domains/scenarios/detail/panel-modal/ScenarioPanelModal.tsx, src/modal-bodies.ts).
  },
  'journal-panel': {
    open: (date, key) => ({ payload: { date, key } }),
    // body : React (src/domains/journal/modal/JournalPanelModal.tsx, src/modal-bodies.ts).
  },
  step: {
    // Une étape neuve naît seule ou déjà ouverte en options : c'est le bouton qui l'a dit.
    open: (scenarioId, stepId, options = 1) => ({
      scenarioId,
      options,
      payload: stepId ? structuredClone(getStep(scenarioId, stepId)) : emptyStep(),
    }),
    // body : React (src/domains/scenarios/detail/step-modal/StepModal.tsx, src/modal-bodies.ts).
    edits: true,
  },
  'paste-import': {
    open: () => ({ payload: { text: '' } }),
    // body : React (src/domains/accommodations/modal/PasteImportModal.tsx, src/modal-bodies.ts).
    width: '640px',
    edits: true,
  },
  phrase: {
    open: (id) => ({ payload: id ? structuredClone(getCustomPhrase(id)) : emptyCustomPhrase() }),
    // body : React (src/domains/phrases/modal/AddTranslationModal.tsx, src/modal-bodies.ts).
    edits: true,
  },
  // body : React (src/shell/SyncModal.tsx, src/modal-bodies.ts).
  sync: {},
  settings: { body: () => settingsForm() },
};
window.MODAL_TYPES = MODAL_TYPES;

const MODAL_RESOURCE_MESSAGES = {
  voyage: ['Voyage créé', 'Voyage modifié'],
  accommodation: ['Hébergement créé', 'Hébergement modifié'],
  'accommodation-booking': ['Hébergement créé', 'Hébergement modifié'],
  'accommodation-home-exchange': ['Hébergement créé', 'Hébergement modifié'],
  'accommodation-airbnb': ['Hébergement créé', 'Hébergement modifié'],
  'accommodation-google-maps': ['Hébergement créé', 'Hébergement modifié'],
  attraction: ['Lieu créé', 'Lieu modifié'],
  ville: ['Ville créée', 'Ville modifiée'],
  transport: ['Transport créé', 'Transport modifié'],
  prestataire: ['Prestataire créé', 'Prestataire modifié'],
  modele: ['Modèle créé', 'Modèle modifié'],
  voiture: ['Offre créée', 'Offre modifiée'],
  charge: ['Charge créée', 'Charge modifiée'],
  'actual-expense': ['Dépense réelle créée', 'Dépense réelle modifiée'],
  'valise-catalogue': ['Article créé', 'Article modifié'],
  step: ['Étape créée', 'Étape modifiée'],
  phrase: ['Phrase ajoutée', 'Phrase modifiée'],
};

document.addEventListener(
  'click',
  (event) => {
    if (!event.target.closest('#f-save') || !modal) return;
    const messages = MODAL_RESOURCE_MESSAGES[modal.type];
    if (!messages) return;
    const message = messages[modal.payload.id ? 1 : 0];
    const openedModal = modal;
    setTimeout(() => {
      if (modal === openedModal) return;
      showToast(message);
    });
  },
  true,
);

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
  dismissAskOpen = false;
  render();
}

/*
  Fermer sur une saisie non enregistrée demande quoi en faire. ModalHost (src/shell/ModalHost.tsx)
  peint le corps de la modale via dangerouslySetInnerHTML : tant que modal.payload ne change pas,
  cfg.body(modal) rend la même chaîne à chaque appel, donc React ne retouche pas ce DOM — rouvrir
  dismissAskOpen et rappeler render() ne perd plus la saisie en cours (l'arrachait quand ce bloc
  vivait hors de #app, peint par un appendChild manuel jamais revisité par un render()).
*/
var dismissAskOpen = false;

function dismissModal() {
  if (!modalIsDirty()) return closeModal();
  if (dismissAskOpen) return;
  dismissAskOpen = true;
  render();
}

function keepEditing() {
  dismissAskOpen = false;
  render();
}

function saveAndClose() {
  keepEditing();
  submitModal();
}

// Le bouton d'enregistrement du formulaire est son seul point d'écriture : chaque type y lit ses
// propres champs, la touche Entrée comme la question de fermeture n'ont qu'à le presser.
function submitModal() {
  document.getElementById('f-save')?.click();
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

// Peint par ModalHost (src/shell/ModalHost.tsx) via dangerouslySetInnerHTML — ces trois lectures
// remplacent l'ancien renderModal() qui créait et appendait le DOM lui-même.
function modalBodyHtml() {
  return MODAL_TYPES[modal.type].body(modal);
}

function modalPanelWidth() {
  const cfg = MODAL_TYPES[modal.type];
  // Un panneau tient toute la hauteur contre le bord droit : sa largeur est la sienne.
  return cfg.width && !modal.sheet ? cfg.width : null;
}

// Rappelé par ModalHost une fois le corps peint dans le DOM (cfg.after lit des champs qui doivent
// déjà exister).
function onModalPainted() {
  const cfg = MODAL_TYPES[modal.type];
  if (cfg.after) cfg.after(modal);
  modalSnapshot = cfg.edits ? modalFieldsState() : null;
}

// Entrée enregistre, Échap ferme ; un champ qui traite lui-même la touche — un tag qu'on ajoute,
// un résultat qu'on choisit — l'a déjà consommée, et une zone de texte y écrit une ligne.
document.addEventListener('keydown', (event) => {
  if (!modal || event.defaultPrevented) return;
  if (event.key === 'Escape') return dismissAskOpen ? keepEditing() : dismissModal();
  if (event.key !== 'Enter' || event.target.tagName === 'TEXTAREA') return;
  if (dismissAsk) saveAndClose();
  else submitModal();
});

/*
  Chaque type de modale déclare comment construire son payload à l'ouverture et comment
  rendre son corps ; les formulaires eux-mêmes vivent dans le dossier de leur vue.
*/

let modal = null; // {type, payload}

const MODAL_TYPES = {
  voyage: {
    open: (id) => ({ payload: id ? { ...getTravel(id) } : emptyTravel() }),
    body: (m) => travelForm(m.payload),
  },
  accommodation: {
    open: (id) => ({ payload: id ? { ...getAccommodation(id) } : emptyAccommodation() }),
    body: (m) => accommodationForm(m.payload),
  },
  ville: {
    open: (id) => ({ payload: id ? { ...getCity(id) } : emptyCity() }),
    body: (m) => cityForm(m.payload),
  },
  voiture: {
    open: (id) => ({ payload: id ? { ...getCar(id) } : emptyCar() }),
    body: (m) => carForm(m.payload),
  },
  charge: {
    open: (id) => ({ payload: id ? { ...getFixedCost(id) } : emptyFixedCost() }),
    body: (m) => fixedCostForm(m.payload),
  },
  step: {
    open: (scenarioId, stepId) => ({
      scenarioId,
      payload: stepId ? { ...getStep(scenarioId, stepId) } : emptyStep(),
    }),
    body: (m) => stepForm(m.payload),
  },
  'paste-import': {
    open: () => ({ payload: { text: '' } }),
    body: () => pasteImportForm(),
    width: '640px',
  },
  sync: { body: () => syncForm() },
};

function openModal(type, a, b) {
  modal = { type, ...MODAL_TYPES[type].open(a, b, type) };
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

  const cfg = MODAL_TYPES[modal.type];
  const style = cfg.width ? `max-width:${cfg.width};` : '';
  container.innerHTML = `<div class="modal" style="${style}">${cfg.body(modal)}</div>`;
  document.getElementById('app').appendChild(container);
}

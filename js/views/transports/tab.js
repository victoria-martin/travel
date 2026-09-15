/*
  La page Transports porte trois listes : les trajets, les loueurs et compagnies chez qui on les
  prend, et les modèles de voiture qu'ils proposent. L'onglet ouvert est le geste en cours et non
  une préférence qu'on retrouve, comme le mode comparer des scénarios : il vit dans une globale,
  hors du hash et hors des prefs.
*/
const TRANSPORT_TABS = [
  {
    key: 'trajets',
    icon: svgIcon('plane'),
    label: 'Trajets',
    count: () => transportsCount(),
    actions: () => transportsHeaderActions(),
    body: () => renderTransportsList(),
  },
  {
    key: 'prestataires',
    icon: svgIcon('building-2'),
    label: 'Loueurs & compagnies',
    count: () => providersCount(),
    actions: () => providersHeaderActions(),
    body: () => renderProvidersTab(),
  },
  {
    key: 'voitures',
    icon: svgIcon('car'),
    label: 'Voitures',
    count: () => carModelsCount(),
    actions: () => carModelsHeaderActions(),
    body: () => renderCarModelsTab(),
  },
];

let transportsTab = 'trajets';

function currentTransportsTab() {
  return TRANSPORT_TABS.find((tab) => tab.key === transportsTab);
}

function setTransportsTab(key) {
  transportsTab = key;
  render();
}

function transportsTabs() {
  return /* HTML */ `<div class="view-tabs" role="tablist">
    ${TRANSPORT_TABS.map((tab) => transportsTabButton(tab)).join('')}
  </div>`;
}

function transportsTabButton(tab) {
  const active = transportsTab === tab.key;
  return /* HTML */ `<button
    class="view-tab ${active ? 'active' : ''}"
    role="tab"
    aria-selected="${active}"
    onclick="setTransportsTab('${tab.key}')"
  >
    <span class="view-tab-icon">${tab.icon}</span>
    <span>${escapeHtml(tab.label)}</span>
    <span class="view-tab-count">${tab.count()}</span>
  </button>`;
}

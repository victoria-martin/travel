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
    sub: () => transportsHeaderSub(),
    actions: () => transportsHeaderActions(),
    body: () => renderTransportsList(),
  },
  {
    key: 'prestataires',
    icon: svgIcon('building-2'),
    label: 'Loueurs & compagnies',
    sub: () => providersHeaderSub(),
    actions: () => providersHeaderActions(),
    body: () => renderProvidersTab(),
  },
  {
    key: 'voitures',
    icon: svgIcon('car'),
    label: 'Voitures',
    sub: () => carModelsHeaderSub(),
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

function transportsTabToggle() {
  return toolbarToggleGroup(
    TRANSPORT_TABS.map((tab) => ({
      icon: tab.icon,
      label: tab.label,
      active: transportsTab === tab.key,
      onclick: `setTransportsTab('${tab.key}')`,
    })),
  );
}

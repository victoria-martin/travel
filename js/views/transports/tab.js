/*
  La page Transports porte deux listes : les trajets, et les loueurs et compagnies chez qui on les
  prend. L'onglet ouvert est le geste en cours et non une préférence qu'on retrouve, comme le mode
  comparer des scénarios : il vit dans une globale, hors du hash et hors des prefs.
*/
const TRANSPORT_TABS = [
  { key: 'trajets', icon: '✈️', label: 'Trajets' },
  { key: 'prestataires', icon: '🏢', label: 'Loueurs & compagnies' },
];

let transportsTab = 'trajets';

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

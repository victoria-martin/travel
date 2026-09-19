/*
  Partagé par la barre latérale (desktop, ordre fixe) et la barre du bas mobile
  ([mobile-nav/](js/views/mobile-nav/), ordre personnalisable) : une seule table, pour que les deux
  ne dérivent pas chacune leur propre liste des huit pages de VIEWS (js/router.js).
*/
const NAV_ITEMS = [
  { key: 'hebergements', label: 'Hébergements', icon: svgIcon('house') },
  { key: 'depenses', label: 'Dépenses', icon: EXPENSE_ICON },
  { key: 'attractions', label: 'Lieux & activités', icon: svgIcon('landmark') },
  { key: 'transports', label: 'Transports', icon: svgIcon('plane') },
  { key: 'scenarios', label: 'Scénarios', icon: svgIcon('compass') },
  { key: 'carte', label: 'Carte', icon: svgIcon('map') },
  { key: 'notes', label: 'Notes', icon: svgIcon('notebook-pen') },
  { key: 'valise', label: 'Valise', icon: svgIcon('luggage') },
  { key: 'a-faire', label: 'À faire', icon: svgIcon('list-checks') },
];

function navItem(key) {
  return NAV_ITEMS.find((item) => item.key === key);
}

/*
  Partagé par la barre latérale (desktop, ordre fixe) et la barre du bas mobile
  ([mobile-nav/](js/views/mobile-nav/), ordre personnalisable) : une seule table, pour que les deux
  ne dérivent pas chacune leur propre liste des huit pages de VIEWS (js/router.js).
*/
const NAV_ITEMS = [
  { key: 'accueil', label: 'Accueil', icon: svgIcon('layout-dashboard') },
  { key: 'hebergements', label: 'Hébergements', icon: svgIcon('house') },
  { key: 'depenses', label: 'Dépenses', icon: EXPENSE_ICON },
  { key: 'attractions', label: 'Lieux & activités', icon: svgIcon('landmark') },
  { key: 'villes', label: 'Villes', icon: svgIcon('map-pin') },
  { key: 'transports', label: 'Transports', icon: svgIcon('plane') },
  { key: 'scenarios', label: 'Scénarios', icon: svgIcon('compass') },
  { key: 'carte', label: 'Carte', icon: svgIcon('map') },
  { key: 'journal', label: 'Journal', icon: svgIcon('book-open') },
  { key: 'notes', label: 'Notes', icon: svgIcon('notebook-pen') },
  { key: 'phrases', label: 'Phrases clé', icon: svgIcon('message-circle') },
  { key: 'infos-utiles', label: 'Infos utiles', icon: svgIcon('siren') },
  { key: 'valise', label: 'Valise', icon: svgIcon('luggage') },
  { key: 'a-faire', label: 'À faire', icon: svgIcon('list-checks') },
];

function navItem(key) {
  return NAV_ITEMS.find((item) => item.key === key);
}

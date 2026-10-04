/*
  Même patron que le panneau latéral du détail d'un scénario
  (js/views/scenarios/detail/side-tabs.js) : la table dit quoi montrer sous quelle icône, un seul
  onglet actif à la fois ou aucun, et sous 640px le même bouton ouvre un sheet plutôt que de pousser
  le contenu sous l'éditeur.
*/
const JOURNAL_SIDE_TABS = [
  { key: 'map', icon: svgIcon('map'), label: 'Carte', body: (date) => journalMapBlock(date) },
];

function onJournalPanelToggle(date, key) {
  if (window.matchMedia('(max-width: 639px)').matches) openSheet('journal-panel', date, key);
  else toggleJournalSidePanel(key);
}

// render() (js/render.js) relance déjà initJournalMap après tout rendu de la page journal.
function toggleJournalSidePanel(key) {
  prefs.journalSidePanel = prefs.journalSidePanel === key ? null : key;
  persistPrefs();
  renderWithTransition();
}

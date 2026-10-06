/*
  Trois peintures pour le même indicateur « hors dispo », testables depuis le menu Affichage sans
  toucher au code : la raison qu'elles portent vient toujours d'availability-check.js.
*/
const OUT_OF_RANGE_STYLES = [
  { key: 'alert', label: 'Pastille rouge', modifier: 'oor-alert', showText: true },
  { key: 'warn', label: 'Pastille ambre', modifier: 'oor-warn', showText: true },
  { key: 'subtle', label: 'Icône seule', modifier: 'oor-subtle', showText: false },
];

window.OUT_OF_RANGE_STYLES = OUT_OF_RANGE_STYLES;

function outOfRangeStyle() {
  return OUT_OF_RANGE_STYLES.find((s) => s.key === prefs.outOfRangeStyle) || OUT_OF_RANGE_STYLES[0];
}

function setOutOfRangeStyle(key) {
  prefs.outOfRangeStyle = key;
  persistPrefs();
  render();
}

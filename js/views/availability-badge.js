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

function outOfRangeStyleOption() {
  const options = OUT_OF_RANGE_STYLES.map((s) => ({
    key: s.key,
    label: s.label,
    preview: /* HTML */ `<span class="oor-badge ${s.modifier}"
      >${svgIcon('triangle-alert')}${s.showText ? ' Hors dispo' : ''}</span
    >`,
  }));
  return radioCardField(
    'Indicateur hors dispo',
    'out-of-range-style',
    options,
    outOfRangeStyle().key,
    'setOutOfRangeStyle',
  );
}

// Le badge d'une ligne ou d'une carte : compact, la raison au survol.
function outOfRangeIndicator(reason) {
  if (!reason) return '';
  const style = outOfRangeStyle();
  return /* HTML */ `<span class="oor-badge ${style.modifier}" title="${escapeHtml(reason)}">
    ${svgIcon('triangle-alert')}${style.showText ? ' Hors dispo' : ''}
  </span>`;
}


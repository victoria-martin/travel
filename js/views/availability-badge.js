/*
  Trois peintures pour le même indicateur « hors dispo », testables depuis le menu Affichage sans
  toucher au code : la raison qu'elles portent vient toujours d'availability-check.js.
*/
const OUT_OF_RANGE_STYLES = [
  { key: 'alert', label: 'Pastille rouge', modifier: 'oor-alert', showText: true },
  { key: 'warn', label: 'Pastille ambre', modifier: 'oor-warn', showText: true },
  { key: 'subtle', label: 'Icône seule', modifier: 'oor-subtle', showText: false },
];

function outOfRangeStyle() {
  return OUT_OF_RANGE_STYLES.find((s) => s.key === prefs.outOfRangeStyle) || OUT_OF_RANGE_STYLES[0];
}

function setOutOfRangeStyle(key) {
  prefs.outOfRangeStyle = key;
  persistPrefs();
  render();
}

function outOfRangeStyleOption() {
  return /* HTML */ `<label class="filter-option">
    Indicateur hors dispo
    <select onchange="setOutOfRangeStyle(this.value)">
      ${OUT_OF_RANGE_STYLES.map(
        (s) =>
          `<option value="${s.key}" ${outOfRangeStyle().key === s.key ? 'selected' : ''}>${s.label}</option>`,
      ).join('')}
    </select>
  </label>`;
}

// Le badge d'une ligne ou d'une carte : compact, la raison au survol.
function outOfRangeIndicator(reason) {
  if (!reason) return '';
  const style = outOfRangeStyle();
  return /* HTML */ `<span class="oor-badge ${style.modifier}" title="${escapeHtml(reason)}">
    ${svgIcon('triangle-alert')}${style.showText ? ' Hors dispo' : ''}
  </span>`;
}

// La bannière d'une fiche : la raison s'y lit toujours en clair, quel que soit le style choisi.
function outOfRangeBanner(reason) {
  if (!reason) return '';
  const style = outOfRangeStyle();
  return /* HTML */ `<div class="oor-banner ${style.modifier}">
    ${svgIcon('triangle-alert')} ${escapeHtml(reason)}
  </div>`;
}

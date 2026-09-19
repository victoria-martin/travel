/*
  Les mêmes filtres à deux endroits : la carte de la colonne à gauche, et le bouton « Filtrer » de
  l'en-tête — `mapFilterFields` porte les champs, chacun choisit son emballage. Un bloc par
  collection tracée, avec l'interrupteur qui la met à l'écran et sous lui sa propre pile de
  niveaux. Éteindre la collection cache aussi ses niveaux — ils ne filtrent plus rien.
  Le scénario, lui, vit dans sa propre carte ([scenario-panel.js](scenario-panel.js)) : il trace le
  trajet et porte son message d'état.
*/
function mapFilterFields() {
  return /* HTML */ `${MAP_KINDS.map(mapResourceBlock).join('')}
    <div class="map-filter-block map-filter-favorites">
      ${switchField(
        `${svgIcon('star', { fill: true })} Favoris uniquement`,
        mapFilters.favOnly,
        'toggleMapFavOnly()',
      )}
    </div>`;
}

function mapFilterPanel() {
  return /* HTML */ `<div class="map-side-panel">
    <div class="map-side-title">Filtres</div>
    ${mapFilterFields()}
  </div>`;
}

function mapFilterButton() {
  return toolbarPanel({
    key: 'filter',
    icon: svgIcon('funnel'),
    label: 'Filtrer',
    count: mapFilterCount(),
    body: `<div class="filter-panel">${mapFilterFields()}</div>`,
  });
}

// Une collection retirée de la carte compte autant qu'un niveau : c'est ce qui n'est plus montré.
function mapFilterCount() {
  const levels = MAP_KINDS.reduce((total, kind) => total + activeFilterCount(mapScope(kind)), 0);
  const hidden = MAP_KINDS.filter((kind) => !mapFilters.shown[kind]).length;
  return levels + hidden + (mapFilters.favOnly ? 1 : 0);
}

function mapResourceBlock(kind) {
  const resource = listResource(kind);
  const shown = mapFilters.shown[kind];
  return /* HTML */ `<div class="map-filter-block">
    ${switchField(
      `<span class="map-resource-icon">${resource.icon}</span><span class="map-resource-label">${escapeHtml(resource.label)}</span>`,
      shown,
      `toggleMapKind('${kind}')`,
    )}
    ${shown ? `<div class="map-filter-levels">${filterLevelsBlock(mapScope(kind))}</div>` : ''}
  </div>`;
}

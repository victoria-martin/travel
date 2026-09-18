let listViewMode = { hebergements: 'table', charges: 'table', valise: 'table' };

function setListMode(kind, mode) {
  listViewMode[kind] = mode;
  render();
}

function listModeToggle(kind, mode) {
  return toolbarToggleGroup([
    {
      icon: svgIcon('rows-3'),
      label: 'Tableau',
      onclick: `setListMode('${kind}','table')`,
      active: mode === 'table',
    },
    {
      icon: svgIcon('layout-grid'),
      label: 'Cartes',
      onclick: `setListMode('${kind}','card')`,
      active: mode === 'card',
    },
  ]);
}

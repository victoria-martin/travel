let listViewMode = { hebergements: 'table', voitures: 'table', charges: 'table' };

function setListMode(kind, mode) {
  listViewMode[kind] = mode;
  render();
}

function listModeToggle(kind, mode) {
  return toolbarToggleGroup([
    {
      icon: '▤',
      label: 'Tableau',
      onclick: `setListMode('${kind}','table')`,
      active: mode === 'table',
    },
    {
      icon: '▦',
      label: 'Cartes',
      onclick: `setListMode('${kind}','card')`,
      active: mode === 'card',
    },
  ]);
}

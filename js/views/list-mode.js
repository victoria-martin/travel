let listViewMode = { hebergements: 'table', voitures: 'table', charges: 'table' };

function setListMode(kind, mode) {
  listViewMode[kind] = mode;
  render();
}

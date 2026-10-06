var listViewMode = { hebergements: 'table', phrases: 'card' };

function setListMode(kind, mode) {
  listViewMode[kind] = mode;
  render();
}

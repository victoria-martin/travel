function deleteItem(dataKey, id) {
  if (!confirm('Supprimer cet élément ?')) return;
  state[dataKey] = state[dataKey].filter((x) => x.id !== id);
  saveNow();
  render();
}

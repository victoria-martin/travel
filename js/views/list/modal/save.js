function saveListItem(kind, id) {
  const cfg = LIST_CONFIG[kind];
  const item = { id: id || uid() };
  cfg.fields.forEach((f) => {
    item[f.key] = document.getElementById('f-' + f.key).value.trim();
  });
  const arr = state[cfg.dataKey];
  if (id) {
    const idx = arr.findIndex((x) => x.id === id);
    arr[idx] = item;
  } else {
    arr.push(item);
  }
  saveNow();
  closeModal();
}

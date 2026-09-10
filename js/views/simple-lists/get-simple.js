function getSimple(kind, id) {
  return id ? state[SIMPLE_CONFIG[kind].dataKey].find((x) => x.id === id) : null;
}

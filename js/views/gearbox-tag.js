function carGearboxTag(c) {
  const current = carGearbox(c.gearbox);
  return `<span class="inline-tag">${tagLabel(current.emoji, current.label)}</span>`;
}

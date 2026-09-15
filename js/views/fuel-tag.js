function carFuelTag(c) {
  const current = carFuel(c.fuel);
  return `<span class="inline-tag">${tagLabel(current.emoji, current.label)}</span>`;
}

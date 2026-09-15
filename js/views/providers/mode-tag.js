function providerModeTag(p) {
  const mode = transportMode(p.mode);
  return `<span class="inline-tag">${tagLabel(mode.emoji, mode.label)}</span>`;
}

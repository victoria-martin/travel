function providerModeTag(p) {
  const mode = transportMode(p.mode);
  return staticTag(mode);
}

const TRAIL_STYLES = [
  { key: 'trail', label: 'Fil' },
  { key: 'strip', label: 'Bande' },
];

window.TRAIL_STYLES = TRAIL_STYLES;

function trailStyle() {
  return TRAIL_STYLES.some((style) => style.key === prefs.trailStyle) ? prefs.trailStyle : 'trail';
}

function setTrailStyle(style) {
  prefs.trailStyle = style;
  persistPrefs();
  render();
}

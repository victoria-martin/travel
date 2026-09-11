/*
  The tab icon is the emoji of the open travel, drawn as an SVG data: URI so no file is needed.
*/
function applyTravelFavicon() {
  const emoji = currentTravel()?.emoji || '🧳';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><text x="32" y="50" font-size="56" text-anchor="middle">${escapeHtml(emoji)}</text></svg>`;
  document.getElementById('favicon').href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

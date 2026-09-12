/*
  The tab carries the open travel: its name as the title, its emoji as the icon, drawn as an
  SVG data: URI so no file is needed.
  Served from a local file or a dev server, the icon gets an orange dot — prod is GitHub Pages.
*/
const LOCAL_HOSTS = ['localhost', '127.0.0.1', '[::1]', ''];

function isLocalEnv() {
  return LOCAL_HOSTS.includes(location.hostname);
}

function applyTravelTab() {
  const travel = currentTravel();
  document.title = travel?.name || 'Voyages';
  document.getElementById('favicon').href = travelFaviconHref(travel?.emoji || '🧳');
}

function travelFaviconHref(emoji) {
  const dot = isLocalEnv()
    ? '<circle cx="50" cy="50" r="15" fill="#FFF" /><circle cx="50" cy="50" r="11" fill="#E08A2E" />'
    : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><text x="32" y="50" font-size="56" text-anchor="middle">${escapeHtml(emoji)}</text>${dot}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/*
  Two ways to open a URL in a new tab: a link inside a cell or a popup, and a button on a card.
  `label` is the caller's own HTML — the popup passes a name it has already escaped.
*/

function externalLink(url, label) {
  return externalAnchor(url, label, 'external-link');
}

function linkButton(url, label) {
  return externalAnchor(url, label, 'btn-ghost btn btn-small');
}

function externalAnchor(url, label, className) {
  return `<a href="${escapeHtml(url)}" target="_blank" class="${className}">${label}</a>`;
}

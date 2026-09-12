/*
  A toolbar button that discloses its own panel. render() rebuilds the DOM, so which panel is open
  lives in a global keyed by panel name. The caller owns what the panel holds.
*/
let openToolbarPanel = null;

function toolbarPanel({ key, icon, label, count, body }) {
  return /* HTML */ `<details
    class="toolbar-panel"
    ${openToolbarPanel === key ? 'open' : ''}
    ontoggle="openToolbarPanel = this.open ? '${key}' : null"
  >
    <summary class="toolbar-btn" title="${escapeHtml(label)}">
      ${toolbarFace(icon, label)}${count ? `<span class="toolbar-count">${count}</span>` : ''}
    </summary>
    <div class="toolbar-panel-body">${body}</div>
  </details>`;
}

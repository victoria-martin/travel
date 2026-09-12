function toolbarButton({ icon, label, onclick, active }) {
  return /* HTML */ `<button
    class="toolbar-btn ${active ? 'active' : ''}"
    onclick="${onclick}"
    title="${escapeHtml(label)}"
    aria-label="${escapeHtml(label)}"
  >
    ${toolbarFace(icon, label)}
  </button>`;
}

function toolbarFace(icon, label) {
  return /* HTML */ `<span class="toolbar-icon">${icon}</span>
    ${showButtonLabels() ? `<span class="toolbar-label">${escapeHtml(label)}</span>` : ''}`;
}

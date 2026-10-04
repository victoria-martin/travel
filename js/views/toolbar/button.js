function toolbarButton({ icon, label, onclick, active, primary }) {
  return /* HTML */ `<button
    class="btn ${primary ? '' : 'btn-outline'} btn-small ${active ? 'active' : ''}"
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

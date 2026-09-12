function toolbarToggleGroup(options) {
  return /* HTML */ `<div class="toggle-group">
    ${options
      .map(
        (o) => `<button
          class="toolbar-btn ${o.active ? 'active' : ''}"
          onclick="${o.onclick}"
          title="${escapeHtml(o.label)}"
          aria-label="${escapeHtml(o.label)}"
        >${toolbarFace(o.icon, o.label)}</button>`,
      )
      .join('')}
  </div>`;
}

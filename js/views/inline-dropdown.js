/*
  The disclosure shared by every inline dropdown: render() rebuilds the DOM, so which one is open
  lives in a global rather than in the element.
*/
let openInlineMenu = null;

function inlineDropdown(menuKey, className, innerHtml) {
  return /* HTML */ `<details
    class="inline-dropdown ${className}"
    ${openInlineMenu === menuKey ? 'open' : ''}
    ontoggle="openInlineMenu = this.open ? '${menuKey}' : null"
  >
    ${innerHtml}
  </details>`;
}

function tagLabel(emoji, label) {
  return /* HTML */ `${emoji ? `<span class="inline-emoji">${emoji}</span>` : ''}
    <span class="inline-label">${label}</span>`;
}

/*
  The disclosure shared by every inline dropdown: render() rebuilds the DOM, so which one is open
  lives in a global rather than in the element. Its menu is laid out in viewport coordinates
  (placeInlineMenu) because the scrollers that hold a trigger — the table wrapper, the main
  column — clip whatever sticks out of them.
*/
let openInlineMenu = null;

const INLINE_MENU_GAP = 4;
const INLINE_MENU_EDGE = 8;

// Where the trigger was when its menu was placed, to tell a real scroll from a restored one.
let placedAnchor = null;

function inlineDropdown(menuKey, className, innerHtml) {
  return /* HTML */ `<details
    class="inline-dropdown ${className}"
    ${openInlineMenu === menuKey ? 'open' : ''}
    ontoggle="openInlineMenu = this.open ? '${menuKey}' : null; placeOpenInlineMenu()"
  >
    ${innerHtml}
  </details>`;
}

function tagLabel(emoji, label) {
  return /* HTML */ `${emoji ? `<span class="inline-emoji">${emoji}</span>` : ''}
    <span class="inline-label">${label}</span>`;
}

/*
  The menu opens below its trigger, above it when the room is on that side, and never past the
  window. Its box is read once laid at 0,0: an ancestor that paints (an opacity, a filter) becomes
  the origin of a fixed child, and that reading tells where the origin is without naming the cases.
*/
function placeInlineMenu(menu, trigger) {
  const anchor = trigger.getBoundingClientRect();
  menu.style.maxHeight = '';
  menu.style.minWidth = anchor.width > 200 ? `${anchor.width}px` : '';
  menu.style.top = '0px';
  menu.style.left = '0px';
  const box = menu.getBoundingClientRect();
  const roomBelow = window.innerHeight - anchor.bottom - INLINE_MENU_GAP - INLINE_MENU_EDGE;
  const roomAbove = anchor.top - INLINE_MENU_GAP - INLINE_MENU_EDGE;
  const below = box.height <= roomBelow || roomBelow >= roomAbove;
  const room = below ? roomBelow : roomAbove;
  if (box.height > room) menu.style.maxHeight = `${room}px`;
  const height = Math.min(box.height, room);
  const top = below ? anchor.bottom + INLINE_MENU_GAP : anchor.top - INLINE_MENU_GAP - height;
  const left = Math.min(
    Math.max(INLINE_MENU_EDGE, anchor.left),
    window.innerWidth - box.width - INLINE_MENU_EDGE,
  );
  menu.style.top = `${top - box.top}px`;
  menu.style.left = `${left - box.left}px`;
  placedAnchor = { trigger, top: anchor.top, left: anchor.left };
}

function placeOpenInlineMenu() {
  document.querySelectorAll('details.inline-dropdown[open]').forEach((details) => {
    const menu = details.querySelector(':scope > .inline-menu');
    const trigger = details.querySelector(':scope > summary');
    if (menu && trigger) placeInlineMenu(menu, trigger);
  });
}

function anchorHasMoved() {
  if (!placedAnchor) return false;
  const now = placedAnchor.trigger.getBoundingClientRect();
  return now.top !== placedAnchor.top || now.left !== placedAnchor.left;
}

function closeOpenInlineMenu() {
  document.querySelectorAll('details.inline-dropdown[open]').forEach((details) => {
    details.open = false;
  });
  openInlineMenu = null;
  placedAnchor = null;
}

/*
  Scrolling moves the trigger away from a menu that no longer follows it, so the menu goes. A
  render restores the scroll of the column it just rebuilt, which fires a scroll of its own: the
  trigger has not moved under that one, and the menu stays.
*/
document.addEventListener(
  'scroll',
  (event) => {
    if (!openInlineMenu || event.target.closest?.('.inline-menu')) return;
    if (anchorHasMoved()) closeOpenInlineMenu();
  },
  true,
);

window.addEventListener('resize', placeOpenInlineMenu);

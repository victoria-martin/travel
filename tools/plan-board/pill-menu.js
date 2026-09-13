// A pill that opens its vocabulary under it: the axis one poses while reading the list, or while
// typing the line that becomes a task. One menu stands open at a time, wherever it hangs.
let openMenuKey = null;

const menuOpen = (key) => openMenuKey === key;

function togglePillMenu(key) {
  openMenuKey = menuOpen(key) ? null : key;
  renderBoard();
}

// Tells whether it had something to put away, so the caller knows a repaint is due.
function closePillMenu() {
  if (!openMenuKey) return false;
  openMenuKey = null;
  return true;
}

const triggerAttributes = (key, act, data, title) =>
  `role="button" tabindex="0" data-act="${act}" ${data} title="${title}"
   aria-pressed="${menuOpen(key)}"`;

const addTrigger = (attributes) => `<span class="pill pill-add" ${attributes}>＋</span>`;

// A trigger wearing the word it carries, a dashed ＋ when it carries none.
const pillTrigger = (word, attributes) => (word ? pill(word, attributes) : addTrigger(attributes));

// The caller writes the menu — its own words, its own act. The shell owns the trigger, where the
// menu hangs, and the fact that it is open.
const pillMenu = (key, trigger, menu) => `<span class="pill-menu">
  ${trigger}
  ${menuOpen(key) ? `<span class="pill-menu-items choices">${menu()}</span>` : ''}
</span>`;

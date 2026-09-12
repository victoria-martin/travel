// Which headings are shut. A view preference of the tool, kept in the browser: the board reloads
// itself at every save, and a section closed on purpose must not reopen behind our back.
// The board and the sidebar fold apart — the same page stays open in one while shut in the other —
// so each scope has its own store.
const FOLD_KEYS = { board: 'plan-board-folded', nav: 'plan-board-nav-folded' };

const folded = Object.fromEntries(
  Object.entries(FOLD_KEYS).map(([scope, key]) => {
    try {
      return [scope, new Set(JSON.parse(localStorage.getItem(key) || '[]'))];
    } catch {
      return [scope, new Set()];
    }
  }),
);

const foldKey = (section, group) => (group ? `${section} / ${group}` : section);
const isFolded = (scope, section, group) => folded[scope].has(foldKey(section, group));

function toggleFold(scope, section, group) {
  const key = foldKey(section, group);
  if (!folded[scope].delete(key)) folded[scope].add(key);
  try {
    localStorage.setItem(FOLD_KEYS[scope], JSON.stringify([...folded[scope]]));
  } catch {
    // A blocked store only costs the preference.
  }
  renderBoard();
}

// The heading itself folds: the whole line is the target, and the chevron trails the name rather
// than cutting in front of it. Shut, the count says how many tasks are hidden.
function foldAttributes(scope, section, group) {
  const place = `data-scope="${scope}" data-section="${esc(section)}"`;
  return `data-act="fold" ${place}${group ? ` data-group="${esc(group)}"` : ''}
    aria-expanded="${!isFolded(scope, section, group)}"
    title="${isFolded(scope, section, group) ? 'Déplier' : 'Replier'}"`;
}

const chevron = () => `<svg class="chev" viewBox="0 0 10 10" aria-hidden="true">
  <path d="M2 4l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.5"
    stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

function foldMark(section, group, tally) {
  return `${chevron()}${isFolded('board', section, group) ? `<span class="tally">${tally}</span>` : ''}`;
}

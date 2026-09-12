// The panel that drops under a field. Its target says where the pick lands: `title` writes into the
// input at the caret, so the same brick serves a title that opens on an emoji and one that carries
// it mid-sentence; `vocabulary` replaces the badge of the type or status being created.
let emojiTarget = '';
let emojiSearch = '';
let titleCaret = null;

const emojiPickerOpen = (target) => emojiTarget === target;

function closeEmojiPicker() {
  emojiTarget = '';
  emojiSearch = '';
  titleCaret = null;
}

function toggleEmojiPicker(target) {
  const reopening = !emojiPickerOpen(target);
  closeEmojiPicker();
  if (reopening) {
    emojiTarget = target;
    const title = ui.getElementById('title');
    titleCaret = title ? title.selectionStart : null;
  }
  renderDrawer();
  const field = ui.getElementById('emoji-search');
  if (field) field.focus();
}

function setEmojiSearch(value) {
  emojiSearch = value;
  renderEmojiGrid();
}

function pickEmoji(char) {
  if (emojiTarget === 'title') return insertInTitle(char);
  setWordEmoji(char);
  closeEmojiPicker();
  renderDrawer();
}

// The caret is read when the panel opens: clicking a tile has already taken the focus away.
function insertInTitle(char) {
  const at = titleCaret === null ? draft.title.length : titleCaret;
  const spaced = draft.title.slice(at).startsWith(' ') ? char : `${char} `;
  draft.title = draft.title.slice(0, at) + spaced + draft.title.slice(at);
  closeEmojiPicker();
  renderDrawer();
  const field = ui.getElementById('title');
  if (!field) return;
  field.focus();
  field.setSelectionRange(at + spaced.length, at + spaced.length);
}

const emojiTiles = () =>
  searchEmojis(emojiSearch)
    .map(
      (entry) => `<button class="emoji-tile" data-act="emoji-pick" data-value="${entry.char}"
        title="${esc(entry.words)}">${entry.char}</button>`,
    )
    .join('') || '<p class="hint">Aucun emoji pour cette recherche.</p>';

function renderEmojiGrid() {
  const grid = ui.getElementById('emoji-grid');
  if (grid) grid.innerHTML = emojiTiles();
}

function emojiPanel(target) {
  if (!emojiPickerOpen(target)) return '';
  return `<div class="emoji-panel">
    <input class="emoji-search" id="emoji-search" data-act="emoji-search"
      value="${esc(emojiSearch)}" placeholder="Chercher : plage, train, musée…" />
    <div class="emoji-grid" id="emoji-grid">${emojiTiles()}</div>
  </div>`;
}

// The panel that drops under a field. Its target says where the pick lands: `section` replaces the
// emoji of the heading being edited, `vocabulary` the badge of the type or status being created.
let emojiTarget = '';
let emojiSearch = '';

const emojiPickerOpen = (target) => emojiTarget === target;

function closeEmojiPicker() {
  emojiTarget = '';
  emojiSearch = '';
}

function toggleEmojiPicker(target) {
  const reopening = !emojiPickerOpen(target);
  closeEmojiPicker();
  if (reopening) emojiTarget = target;
  renderDrawer();
  const field = ui.getElementById('emoji-search');
  if (field) field.focus();
}

function setEmojiSearch(value) {
  emojiSearch = value;
  renderEmojiGrid();
}

function pickEmoji(char) {
  if (emojiTarget === 'section') setSectionEmoji(char);
  else setWordEmoji(char);
  closeEmojiPicker();
  renderDrawer();
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

// A type or a status the frozen lists do not hold yet, typed under the choices it joins. The server
// writes it into types.js / statuses.js, so the next load reads it from code like every other entry.
let newWord = null;
let newWordError = '';

const wordList = (kind) => (kind === 'type' ? PLAN_TYPES : PLAN_STATUSES);
const wordTones = (kind) => [...new Set(wordList(kind).map((entry) => entry.tone))];
const setWordEmoji = (char) => (newWord.emoji = char);

// Clicking the open kind folds the form; clicking the other one switches it over.
function toggleNewWord(kind) {
  if (newWord && newWord.kind === kind) return closeNewWord();
  openNewWord(kind);
}

function openNewWord(kind) {
  closeEmojiPicker();
  newWordError = '';
  newWord = { kind, label: '', emoji: '🏷️', tone: wordTones(kind)[0], hint: '' };
  renderDrawer();
  ui.getElementById('word-label').focus();
}

function resetNewWord() {
  newWord = null;
  newWordError = '';
}

function closeNewWord() {
  resetNewWord();
  closeEmojiPicker();
  renderDrawer();
}

// Typing only arms the button; re-rendering here would take the focus out of the input.
function editNewWord(field, value) {
  newWord[field] = value;
  const add = ui.getElementById('word-add');
  if (add) add.disabled = !newWord.label.trim();
}

function pickWordTone(tone) {
  newWord.tone = tone;
  renderDrawer();
}

// The word joins the live list as well as the file, and the draft picks it right away.
async function addNewWord() {
  const { kind } = newWord;
  try {
    const { word } = await api('/api/vocabulary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newWord),
    });
    wordList(kind).push(word);
    newWord = null;
    if (kind === 'type') toggleDraftType(word.label);
    else editDraft('status', word.label);
    renderBoard();
  } catch (error) {
    newWordError = error.message;
    renderDrawer();
  }
}

function newWordButton(kind) {
  const label = kind === 'type' ? '＋ nouveau type…' : '＋ nouveau statut…';
  const open = Boolean(newWord) && newWord.kind === kind;
  return `<button class="btn btn-slim" data-act="new-word" data-value="${kind}"
    aria-pressed="${open}">${label}</button>`;
}

// The tone is shown as it will paint, not as a word: it is the only way to read what it does.
function toneChoices(kind) {
  return wordTones(kind)
    .map((tone) => {
      const classes = kind === 'type' ? `pill pill-type type-${tone}` : `pill pill-${tone}`;
      return `<span class="${classes}" role="button" tabindex="0" data-act="word-tone"
        data-value="${tone}" aria-pressed="${newWord.tone === tone}">${tone}</span>`;
    })
    .join('');
}

function newWordForm(kind) {
  if (!newWord || newWord.kind !== kind) return '';
  const hint =
    kind === 'type'
      ? `<input class="word-hint" data-act="word-hint" value="${esc(newWord.hint)}"
          placeholder="L’infobulle : à quoi sert ce type" />`
      : '';

  return `<div class="new-word">
    <div class="field-row">
      <button class="btn emoji-btn" data-act="emoji" data-value="vocabulary"
        title="Choisir l’emoji" aria-pressed="${emojiPickerOpen('vocabulary')}">
        ${newWord.emoji}
      </button>
      <input class="word-label" id="word-label" data-act="word-label" value="${esc(newWord.label)}"
        placeholder="${kind === 'type' ? 'Le type, en un ou deux mots' : 'Le statut, en un ou deux mots'}" />
    </div>
    ${emojiPanel('vocabulary')}
    <label class="field-label">Ton <span class="field-note">la couleur de la pastille</span></label>
    <div class="choices">${toneChoices(kind)}</div>
    ${hint}
    ${newWordError ? `<p class="hint hint-warn">${esc(newWordError)}</p>` : ''}
    <div class="field-row">
      <button class="btn btn-primary" id="word-add" data-act="word-add"
        ${newWord.label.trim() ? '' : 'disabled'}>Ajouter</button>
      <button class="btn" data-act="word-cancel">Annuler</button>
    </div>
  </div>`;
}

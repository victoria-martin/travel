// A word the frozen lists do not hold yet, typed under the choices it joins. The server writes it
// into types.js / statuses.js / priorities.js, so the next load reads it from code like the rest.
let newWord = null;
let newWordError = '';

const WORD_KINDS = {
  type: { list: () => PLAN_TYPES, title: 'Nouveau type', placeholder: 'Le type' },
  priority: { list: () => PLAN_PRIORITIES, title: 'Nouvelle priorité', placeholder: 'La priorité' },
  status: { list: () => PLAN_STATUSES, title: 'Nouveau statut', placeholder: 'Le statut' },
};

const setWordEmoji = (char) => (newWord.emoji = char);

// Clicking the open kind folds the form; clicking the other one switches it over.
function toggleNewWord(kind) {
  if (newWord && newWord.kind === kind) return closeNewWord();
  openNewWord(kind);
}

function openNewWord(kind) {
  closeEmojiPicker();
  newWordError = '';
  newWord = { kind, label: '', emoji: '🏷️', variant: 'default' };
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

function pickWordVariant(variant) {
  newWord.variant = variant;
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
    WORD_KINDS[kind].list().push(word);
    newWord = null;
    if (kind === 'type') toggleDraftType(word.label);
    else editDraft(kind, word.label);
    renderBoard();
  } catch (error) {
    newWordError = error.message;
    renderDrawer();
  }
}

// The row already says what it holds: the plus joins it as one more choice, named by its tooltip.
function newWordButton(kind) {
  const { title } = WORD_KINDS[kind];
  const open = Boolean(newWord) && newWord.kind === kind;
  return `<span class="pill pill-add" role="button"
    tabindex="0" data-act="new-word" data-value="${kind}" title="${title}" aria-label="${title}"
    aria-pressed="${open}">＋</span>`;
}

// The variant is shown as it will paint, not as a word: it is the only way to read what it does.
function variantChoices() {
  return Object.keys(PILL_VARIANTS)
    .map((variant) => {
      return `<span class="pill ${pillClass(variant)}" role="button" tabindex="0"
        data-act="word-variant" data-value="${variant}"
        aria-pressed="${newWord.variant === variant}">${variant}</span>`;
    })
    .join('');
}

function newWordForm(kind) {
  if (!newWord || newWord.kind !== kind) return '';

  return `<div class="new-word">
    <div class="field-row">
      <button class="btn emoji-btn" data-act="emoji" data-value="vocabulary"
        title="Choisir l’emoji" aria-pressed="${emojiPickerOpen('vocabulary')}">
        ${newWord.emoji}
      </button>
      <input class="word-label" id="word-label" data-act="word-label" value="${esc(newWord.label)}"
        placeholder="${WORD_KINDS[kind].placeholder}, en un ou deux mots" />
    </div>
    ${emojiPanel('vocabulary')}
    <label class="field-label">Couleur <span class="field-note">la teinte de la pastille</span></label>
    <div class="choices">${variantChoices()}</div>
    ${newWordError ? `<p class="hint hint-warn">${esc(newWordError)}</p>` : ''}
    <div class="field-row">
      <button class="btn btn-primary" id="word-add" data-act="word-add"
        ${newWord.label.trim() ? '' : 'disabled'}>Ajouter</button>
      <button class="btn" data-act="word-cancel">Annuler</button>
    </div>
  </div>`;
}

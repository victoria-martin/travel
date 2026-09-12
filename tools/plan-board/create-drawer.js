// A new task belongs to a section — the app's views, `Transverse` being the global one. A section
// that does not exist yet is typed here and written as a heading by the first task that needs it.
const NEW_SCOPE = '__new__';

const scopeValue = (section, subsection) => [section, subsection].filter(Boolean).join(' › ');
const firstScope = () => (board.sections.length ? board.sections[0].name : '');
const canCreate = () => Boolean(draft.title.trim() && draft.scope.trim());

function openCreateDrawer() {
  drawerMode = 'create';
  closeEmojiPicker();
  resetNewWord();
  openTaskId = null;
  if (location.hash !== '#new') history.replaceState(null, '', '#new');
  draft = {
    scope: firstScope(),
    newScope: false,
    title: '',
    types: [],
    status: NEW_STATUS,
    body: '',
  };
  renderBoard();
  renderDrawer();
  ui.getElementById('title').focus();
}

function pickScope(value) {
  if (value !== NEW_SCOPE) return (draft.scope = value);
  draft.newScope = true;
  draft.scope = '';
  renderDrawer();
  ui.getElementById('scope').focus();
}

function backToScopeList() {
  draft.newScope = false;
  draft.scope = firstScope();
  renderDrawer();
}

function scopeField() {
  const label = (note) =>
    `<label for="scope">Portée <span class="field-note">${note}</span></label>`;

  if (draft.newScope) {
    return `<div class="field">
      ${label('une page qui n’existe pas encore')}
      <div class="field-row">
        <input class="scope-input" id="scope" data-act="scope-name" value="${esc(draft.scope)}"
          placeholder="Sync — ou « Sync › Conflits » pour une sous-section" />
        <button class="btn" data-act="scope-pick">Choisir dans la liste</button>
      </div>
    </div>`;
  }

  const options = board.sections
    .flatMap((section) => [
      section.name,
      ...section.subsections.map((sub) => scopeValue(section.name, sub)),
    ])
    .map(
      (value) =>
        `<option value="${esc(value)}" ${value === draft.scope ? 'selected' : ''}>${esc(value)}</option>`,
    )
    .join('');

  return `<div class="field">
    ${label('la page à laquelle elle appartient')}
    <select class="scope-input" id="scope" data-act="scope">
      ${options}
      <option value="${NEW_SCOPE}">＋ nouvelle portée…</option>
    </select>
  </div>`;
}

function renderCreateDrawer() {
  paintDrawer({
    where: 'Nouvelle tâche',
    body: scopeField() + draftFields(),
    foot: `
      <button class="btn btn-primary" id="save" data-act="save" ${canCreate() ? '' : 'disabled'}>
        Créer
      </button>
      <button class="btn" data-act="cancel">Annuler</button>`,
  });
}

async function createDraft() {
  const [section, subsection = ''] = draft.scope.split('›').map((part) => part.trim());
  const result = await api('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...draft, section, subsection }),
  });
  board = result;
  openDrawer(result.created);
}

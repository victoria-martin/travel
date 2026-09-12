// A section is its `##` heading and nothing else. The drawer edits the two halves of that line:
// the emoji, which is decoration, and the name, which every task under it points at.
let sectionDraft = null;
let sectionError = '';

function openSectionDrawer(name) {
  const section = board.sections.find((entry) => entry.name === name);
  if (!section) return;
  drawerMode = 'section';
  closeEmojiPicker();
  resetNewWord();
  resetNewSubsection();
  openTaskId = null;
  subsectionDraft = null;
  draft = null;
  sectionError = '';
  sectionDraft = { was: section, emoji: section.emoji, name: section.name };
  renderBoard();
  renderDrawer();
}

const sectionDirty = () =>
  Boolean(sectionDraft.name.trim()) &&
  (sectionDraft.name !== sectionDraft.was.name || sectionDraft.emoji !== sectionDraft.was.emoji);

const setSectionEmoji = (char) => (sectionDraft.emoji = char);

// Typing only arms the button; re-rendering here would take the focus out of the input.
function editSectionDraft(value) {
  sectionDraft.name = value;
  refreshDrawerFoot();
}

// The groups of the page, listed where the page is edited: each one opens its own drawer.
function sectionGroups() {
  const names = sectionOf(sectionDraft.was.name).subsections || [];
  if (!names.length) return '<p class="hint">Aucun groupe pour l’instant.</p>';
  return `<div class="group-list">${names
    .map(
      (name) => `<button class="group-row" data-act="subsection-edit"
        data-section="${esc(sectionDraft.was.name)}" data-value="${esc(name)}">${esc(name)}</button>`,
    )
    .join('')}</div>`;
}

function renderSectionDrawer() {
  paintDrawer({
    where: 'Section',
    body: `
      <div class="field">
        <label for="section-title">Nom</label>
        <div class="field-row">
          <button class="btn emoji-btn" data-act="emoji" data-value="section"
            title="Choisir l’emoji" aria-pressed="${emojiPickerOpen('section')}">
            ${sectionDraft.emoji || '🙂'}
          </button>
          <input class="title-input" id="section-title" data-act="section-title"
            value="${esc(sectionDraft.name)}" placeholder="Le nom de la page" />
        </div>
        ${emojiPanel('section')}
        <p class="hint">L’emoji ouvre le titre dans PLAN.md ; il ne fait pas partie du nom.</p>
      </div>

      <div class="field">
        <label>Groupes <span class="field-note">les <code>###</code> de la page</span></label>
        ${sectionGroups()}
        ${subsectionAddRow(sectionDraft.was.name)}
        ${newSubsectionForm(sectionDraft.was.name, 'drawer')}
      </div>
      ${sectionError ? `<p class="hint hint-warn">${esc(sectionError)}</p>` : ''}`,
    foot: `
      <button class="btn btn-primary" id="save" data-act="save" ${sectionDirty() ? '' : 'disabled'}>
        Enregistrer
      </button>
      <button class="btn" data-act="cancel">Annuler</button>`,
  });
}

async function saveSection() {
  try {
    board = await api('/api/sections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: sectionDraft.was.name,
        emoji: sectionDraft.emoji,
        title: sectionDraft.name,
      }),
    });
    closeDrawer();
  } catch (error) {
    sectionError = error.message;
    renderDrawer();
  }
}

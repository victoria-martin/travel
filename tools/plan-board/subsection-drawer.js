// A subsection is its `###` heading and nothing else. Unlike a section it carries no emoji: the
// page wears the icon, the group inside it only has a name.
let subsectionDraft = null;
let subsectionError = '';

function openSubsectionDrawer(section, name) {
  drawerMode = 'subsection';
  closeEmojiPicker();
  resetNewWord();
  resetNewSubsection();
  openTaskId = null;
  draft = null;
  sectionDraft = null;
  subsectionError = '';
  subsectionDraft = { was: { section, name }, name };
  renderBoard();
  renderDrawer();
}

const subsectionDirty = () =>
  Boolean(subsectionDraft.name.trim()) && subsectionDraft.name !== subsectionDraft.was.name;

// Typing only arms the button; re-rendering here would take the focus out of the input.
function editSubsectionDraft(value) {
  subsectionDraft.name = value;
  refreshDrawerFoot();
}

function renderSubsectionDrawer() {
  paintDrawer({
    where: `Groupe · ${esc(subsectionDraft.was.section)}`,
    body: `
      <div class="field">
        <label for="subsection-title">Nom</label>
        <input class="title-input" id="subsection-title" data-act="subsection-title"
          value="${esc(subsectionDraft.name)}" placeholder="Le nom du groupe" />
        <p class="hint">Renommer le titre emmène les tâches qu’il regroupe.</p>
      </div>
      ${subsectionError ? `<p class="hint hint-warn">${esc(subsectionError)}</p>` : ''}`,
    foot: `
      <button class="btn btn-primary" id="save" data-act="save"
        ${subsectionDirty() ? '' : 'disabled'}>Enregistrer</button>
      <button class="btn" data-act="cancel">Annuler</button>`,
  });
}

async function saveSubsection() {
  try {
    board = await api('/api/subsections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section: subsectionDraft.was.section,
        name: subsectionDraft.was.name,
        title: subsectionDraft.name,
      }),
    });
    closeDrawer();
  } catch (error) {
    subsectionError = error.message;
    renderDrawer();
  }
}

// The panel shell and the fields both modes share. What differs — the head, the foot and what
// sits under the fields — is passed in by the mode.
let drawerMode = null;
let draft = null;

const drawerEl = () => ui.getElementById('drawer');

function editDraft(field, value) {
  draft[field] = value;
  if (field === 'status' || field === 'types') renderDrawer();
  else refreshDrawerFoot();
}

function toggleDraftType(label) {
  draft.types = draft.types.includes(label)
    ? draft.types.filter((entry) => entry !== label)
    : [...draft.types, label];
  renderDrawer();
}

function closeDrawer() {
  closeEmojiPicker();
  resetNewWord();
  sectionDraft = null;
  subsectionDraft = null;
  resetNewSubsection();
  if (location.hash) history.replaceState(null, '', location.pathname);
  drawerMode = null;
  openTaskId = null;
  draft = null;
  archiveArmed = false;
  drawerEl().hidden = true;
  ui.getElementById('overlay').hidden = true;
  renderBoard();
  runQueuedReload();
}

function draftFields() {
  return `
    <div class="field">
      <label for="title">Titre</label>
      <input class="title-input" id="title" data-act="title" value="${esc(draft.title)}"
        placeholder="Ce qu'il y a à faire" />
    </div>

    <div class="field">
      <label>Type <span class="field-note">plusieurs possibles</span></label>
      <div class="choices">
        ${PLAN_TYPES.map((type) =>
          pill(
            type,
            `role="button" tabindex="0" data-act="pick-type" data-value="${type.label}"
             aria-pressed="${draft.types.includes(type.label)}"`,
          ),
        ).join('')}
        ${newWordButton('type')}
      </div>
      ${newWordForm('type')}
    </div>

    <div class="field">
      <label>Statut</label>
      <div class="choices">
        ${PLAN_STATUSES.map((status) =>
          pill(
            status,
            `role="button" tabindex="0" data-act="pick-status" data-value="${status.label}"
             aria-pressed="${draft.status === status.label}"`,
          ),
        ).join('')}
        ${newWordButton('status')}
      </div>
      ${newWordForm('status')}
    </div>

    <div class="field">
      <label for="body">Détail</label>
      <textarea class="body-input" id="body" data-act="body"
        placeholder="Markdown, tel qu'il sera écrit dans PLAN.md">${esc(draft.body)}</textarea>
    </div>`;
}

// Read at call time: each mode lives in its own file, loaded after this one.
const drawerModes = () => ({
  create: { render: renderCreateDrawer, canSave: canCreate, save: createDraft },
  section: { render: renderSectionDrawer, canSave: sectionDirty, save: saveSection },
  subsection: { render: renderSubsectionDrawer, canSave: subsectionDirty, save: saveSubsection },
  task: { render: renderTaskDrawer, canSave: isDirty, save: saveDraft },
});
const currentDrawer = () => drawerModes()[drawerMode];

const renderDrawer = () => currentDrawer().render();

function paintDrawer({ where, body, foot }) {
  drawerEl().innerHTML = `
    <div class="drawer-head">
      <span class="drawer-where">${where}</span>
      <button class="icon-btn" data-act="close" title="Fermer (Échap)">✕</button>
    </div>
    <div class="drawer-body">${body}</div>
    <div class="drawer-foot">${foot}</div>`;
  drawerEl().hidden = false;
  ui.getElementById('overlay').hidden = false;
}

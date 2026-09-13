// The panel shell and the fields both modes share. What differs — the head, the foot and what
// sits under the fields — is passed in by the mode.
let drawerMode = null;
let draft = null;

const drawerEl = () => ui.getElementById('drawer');

const REPAINTED_FIELDS = ['status', 'priority', 'types'];

function editDraft(field, value) {
  draft[field] = value;
  if (REPAINTED_FIELDS.includes(field)) renderDrawer();
  else refreshDrawerFoot();
}

function toggleDraftType(label) {
  draft.types = draft.types.includes(label)
    ? draft.types.filter((entry) => entry !== label)
    : [...draft.types, label];
  renderDrawer();
}

// A task carries one priority or none: clicking the one it wears takes it off again.
const toggleDraftPriority = (label) => editDraft('priority', draft.priority === label ? '' : label);

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

// A row of pills where one act picks a word, each saying whether the draft wears it.
const wordChoices = (words, act, isActive) =>
  words
    .map((word) =>
      pill(
        word,
        `role="button" tabindex="0" data-act="${act}" data-value="${word.label}"
         aria-pressed="${isActive(word.label)}"`,
      ),
    )
    .join('');

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
        ${wordChoices(PLAN_TYPES, 'pick-type', (label) => draft.types.includes(label))}
        ${newWordButton('type')}
      </div>
      ${newWordForm('type')}
    </div>

    <div class="field">
      <label>Priorité <span class="field-note">facultative, recliquer l'enlève</span></label>
      <div class="choices">
        ${wordChoices(PLAN_PRIORITIES, 'pick-priority', (label) => draft.priority === label)}
        ${newWordButton('priority')}
      </div>
      ${newWordForm('priority')}
    </div>

    <div class="field">
      <label>Statut</label>
      <div class="choices">
        ${wordChoices(PLAN_STATUSES, 'pick-status', (label) => draft.status === label)}
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

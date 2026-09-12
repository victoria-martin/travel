// A `###` groups the tasks of one page. It is typed where it will stand: at the foot of its
// section on the board, under its page in the sidebar, or from the section drawer — one form at a
// time, so the state remembers which of the three is open.
let newSubsection = null;
let newSubsectionError = '';

const newSubsectionOpen = (section, where) =>
  Boolean(newSubsection) && newSubsection.section === section && newSubsection.where === where;

// The board always repaints; the drawer only when it is the one holding the form or the list.
function repaintSubsections() {
  renderBoard();
  if (drawerMode === 'section') renderDrawer();
}

function toggleNewSubsection(section, where) {
  if (newSubsectionOpen(section, where)) return closeNewSubsection();
  newSubsection = { section, where, name: '' };
  newSubsectionError = '';
  repaintSubsections();
  ui.getElementById('subsection-name').focus();
}

function closeNewSubsection() {
  newSubsection = null;
  newSubsectionError = '';
  repaintSubsections();
}

// Closing the drawer takes its own form along, and leaves the two others alone.
function resetNewSubsection() {
  if (newSubsection && newSubsection.where !== 'drawer') return;
  newSubsection = null;
  newSubsectionError = '';
}

// Typing only arms the button; re-rendering here would take the focus out of the input.
function editNewSubsection(value) {
  newSubsection.name = value;
  const add = ui.getElementById('subsection-add');
  if (add) add.disabled = !newSubsection.name.trim();
}

async function addNewSubsection() {
  const { section, name } = newSubsection;
  try {
    board = await api('/api/subsections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, name }),
    });
    newSubsection = null;
    newSubsectionError = '';
  } catch (error) {
    newSubsectionError = error.message;
  }
  repaintSubsections();
}

// The `+` sits at the end of a section row, in the sidebar as on the board. In the drawer the
// groups are a list, so adding one is a line under it.
const subsectionAddButton = (section, where) => `<button class="row-add" data-act="new-subsection"
  data-section="${esc(section)}" data-where="${where}" title="Nouveau groupe"
  aria-pressed="${newSubsectionOpen(section, where)}">＋</button>`;

const subsectionAddRow = (section) => `<button class="ghost-add" data-act="new-subsection"
  data-section="${esc(section)}" data-where="drawer">＋ nouveau groupe…</button>`;

// Wherever the `+` was pressed, the form stands where the group will: at the foot of its section.
function newSubsectionForm(section, where) {
  if (!newSubsectionOpen(section, where)) return '';

  return `<div class="new-subsection">
    <div class="inline-form">
      <input class="subsection-input" id="subsection-name" data-act="subsection-name"
        value="${esc(newSubsection.name)}" placeholder="Le nom du groupe" />
      ${confirmButton('subsection-add', 'subsection-add', newSubsection.name.trim())}
      ${cancelButton('subsection-cancel')}
    </div>
    ${newSubsectionError ? `<p class="hint hint-warn">${esc(newSubsectionError)}</p>` : ''}
  </div>`;
}

let board = { tasks: [], archived: [], sections: [] };
let firstRender = true;
let activeStatuses = [];
let activeTypes = [];
let showArchived = false;
let search = '';

// #app moves between documents when the window is detached; everything reads through this.
let ui = document;

function setUiDocument(target) {
  ui.removeEventListener('keydown', onKeydown);
  ui = target;
  ui.addEventListener('keydown', onKeydown);
}

const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  );

async function api(url, options) {
  const response = await fetch(url, options);
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || response.statusText);
  return payload;
}

async function loadBoard() {
  board = await api('/api/tasks');
  renderBoard();
}

const allTasks = () => [
  ...board.tasks,
  ...board.archived.map((task) => ({ ...task, archived: true })),
];

function visibleTasks() {
  const needle = search.trim().toLowerCase();
  return allTasks().filter((task) => {
    if (Boolean(task.archived) !== showArchived) return false;
    if (activeStatuses.length && !activeStatuses.includes(task.status)) return false;
    if (activeTypes.length && !task.types.some((type) => activeTypes.includes(type))) return false;
    if (!needle) return true;
    return `${task.title} ${task.body} ${task.section}`.toLowerCase().includes(needle);
  });
}

function statusPill(label, attributes = '') {
  const status = planStatus(label);
  if (!status) return '';
  return `<span class="pill ${pillClass(status.variant)}" ${attributes}><span>${status.emoji}</span><span>${status.label}</span></span>`;
}

// A row has no space for labels: the emoji alone, named by its tooltip.
function typeDot(label) {
  const type = planType(label);
  return type ? `<span class="type-dot" title="${type.label}">${type.emoji}</span>` : '';
}

function typePill(label, attributes = '') {
  const type = planType(label);
  if (!type) return '';
  return `<span class="pill pill-type ${pillClass(type.variant)}" ${attributes}><span>${type.emoji}</span><span>${type.label}</span></span>`;
}

function toggleType(label) {
  activeTypes = activeTypes.includes(label)
    ? activeTypes.filter((entry) => entry !== label)
    : [...activeTypes, label];
  renderBoard();
}

function toggleStatus(label) {
  activeStatuses = activeStatuses.includes(label)
    ? activeStatuses.filter((entry) => entry !== label)
    : [...activeStatuses, label];
  renderBoard();
}

function clearFilters() {
  activeStatuses = [];
  activeTypes = [];
  renderBoard();
}

function toggleArchived() {
  showArchived = !showArchived;
  renderBoard();
}

function setSearch(value) {
  search = value;
  renderBoard();
}

function renderFilters() {
  const shown = allTasks().filter((task) => Boolean(task.archived) === showArchived);
  const tally = (key) => {
    const counts = {};
    shown.forEach((task) =>
      [].concat(task[key]).forEach((value) => (counts[value] = (counts[value] || 0) + 1)),
    );
    return counts;
  };
  const byType = tally('types');
  const byStatus = tally('status');

  const chip = (entry, count, act, active) => `<button class="filter" data-act="${act}"
    data-value="${entry.label}" aria-pressed="${active}">
    ${entry.emoji} ${entry.label} <span class="tally">${count || 0}</span>
  </button>`;

  const types = PLAN_TYPES.map((type) =>
    chip(type, byType[type.label], 'type', activeTypes.includes(type.label)),
  ).join('');
  const statuses = PLAN_STATUSES.map((status) =>
    chip(status, byStatus[status.label], 'status', activeStatuses.includes(status.label)),
  ).join('');

  const archived = `<button class="filter filter-archived" data-act="archived"
    aria-pressed="${showArchived}">
    📦 archivées <span class="tally">${board.archived.length}</span>
  </button>`;

  const clear =
    activeStatuses.length || activeTypes.length
      ? '<button class="filter-clear" data-act="clear-filters">tout afficher</button>'
      : '';

  ui.getElementById('filters').innerHTML =
    `<div class="filter-row">${types}</div>` +
    `<div class="filter-row">${statuses}${archived}${clear}</div>`;
}

// The order of the file is the order on screen: the skeleton is PLAN.md and the visible tasks fall
// into it. A scope that holds no task at all stays on screen — nothing there can be filtered out,
// and it is where the first one gets typed.
const scopeTasks = (tasks, section, subsection) =>
  tasks.filter((task) => task.section === section && task.subsection === subsection);

function scopeGroups(section, tasks) {
  const groups = [];
  const own = scopeTasks(tasks, section.name, '');
  const bare = !board.tasks.some((task) => task.section === section.name);
  if (own.length || bare) groups.push({ name: '', tasks: own });

  section.subsections.forEach((name) => {
    const inside = scopeTasks(tasks, section.name, name);
    const empty = !scopeTasks(board.tasks, section.name, name).length;
    if (inside.length || empty) groups.push({ name, tasks: inside });
  });
  return groups;
}

function boardScopes(tasks) {
  return board.sections
    .map((section) => ({ name: section.name, groups: scopeGroups(section, tasks) }))
    .filter((section) => section.groups.length);
}

// An archived task is out of PLAN.md: it groups under the scope it remembers, not under the file.
function groupBySection(tasks) {
  const sections = [];
  tasks.forEach((task) => {
    let section = sections.find((entry) => entry.name === task.section);
    if (!section) sections.push((section = { name: task.section, groups: [] }));
    let group = section.groups.find((entry) => entry.name === task.subsection);
    if (!group) section.groups.push((group = { name: task.subsection, tasks: [] }));
    group.tasks.push(task);
  });
  return sections;
}

const anchorOf = (name) => `s-${name.replace(/[^\w]+/g, '-')}`;
const subAnchorOf = (section, name) => `${anchorOf(section)}-${anchorOf(name)}`;

// The board groups the visible tasks by section name; the emoji is carried by the heading itself.
const sectionOf = (name) => board.sections.find((entry) => entry.name === name) || { emoji: '' };

// Markdown reads badly on one line: keep the words, drop the syntax.
const plainText = (markdown) =>
  markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_]/g, '')
    .replace(/^\s*-\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();

// The card carries its own actions, so it is a row and not a button: the clickable part that opens
// the drawer is the one inside it.
function taskButton(task) {
  return `<div class="task" data-id="${task.id}" draggable="true"
    data-section="${esc(task.section)}" data-subsection="${esc(task.subsection)}"
    aria-current="${task.id === openTaskId}">
    <button class="task-open" draggable="true" data-act="open" data-id="${task.id}">
      ${statusPill(task.status)}
      <span class="task-types">${task.types.map(typeDot).join('')}</span>
      <span class="task-title">${esc(task.title)}</span>
      <span class="task-excerpt">${esc(plainText(task.body).slice(0, 140))}</span>
    </button>
    ${task.session ? '<span class="task-session" title="Session liée">💬</span>' : ''}
    ${taskActionButtons(task)}
  </div>`;
}

// A `###` title folds the tasks it groups; the pencil at its end opens the drawer that renames it.
const groupTitle = (section, group) => `<h3 class="group-title"
  id="${subAnchorOf(section, group.name)}" ${foldAttributes('board', section, group.name)}>
  <span>${esc(group.name)}</span>
  ${foldMark(section, group.name, group.tasks.length)}
  <button class="row-edit" data-act="subsection-edit" data-section="${esc(section)}"
    data-value="${esc(group.name)}" title="Renommer le groupe">✎</button>
</h3>`;

// Clicking the page title folds it; the emoji, as in the sidebar, opens the drawer that edits it.
const sectionTitle = (section) => `<h2 class="section-title"
  id="${anchorOf(section.name)}" ${foldAttributes('board', section.name, '')}>
  <button class="title-emoji" data-act="section-edit" data-value="${esc(section.name)}"
    title="Emoji et nom de la section">${sectionOf(section.name).emoji || '·'}</button>
  <span>${esc(section.name)}</span>
  ${foldMark(
    section.name,
    '',
    section.groups.reduce((sum, group) => sum + group.tasks.length, 0),
  )}
</h2>`;

// A folded heading hides everything it holds — its groups, their tasks, and the lines that add one.
function sectionBody(section) {
  return (
    section.groups
      .map((group) => {
        const shut = group.name && isFolded('board', section.name, group.name);
        return (
          (group.name ? groupTitle(section.name, group) : '') +
          (shut
            ? ''
            : group.tasks.map(taskButton).join('') +
              (showArchived ? '' : newTaskForm(section.name, group.name)))
        );
      })
      .join('') + (showArchived ? '' : newSubsectionForm(section.name, 'board'))
  );
}

function renderBoard() {
  renderFilters();
  const tasks = visibleTasks();
  const sections = showArchived ? groupBySection(tasks) : boardScopes(tasks);

  ui.getElementById('count').textContent = `${tasks.length} tâche${tasks.length > 1 ? 's' : ''}`;
  ui.getElementById('detach').textContent =
    detached && !detached.closed ? '⇤ Rattacher' : '⧉ Détacher';
  ui.getElementById('theme').textContent = theme === 'dev' ? '☀︎' : '☾';

  renderSections(sections);

  const boardEl = ui.getElementById('board');
  boardEl.className = firstRender ? 'enter' : '';
  firstRender = false;
  boardEl.innerHTML =
    sections
      .map(
        (section) => `<section class="section">
          <div class="section-head">
            ${sectionTitle(section)}
            ${showArchived ? '' : subsectionAddButton(section.name, 'board')}
          </div>
          ${isFolded('board', section.name) ? '' : sectionBody(section)}
        </section>`,
      )
      .join('') || '<p class="empty">Aucune tâche ne correspond.</p>';
  bindTaskDrag(boardEl);
}

// One listener set, on the node that travels to the detached window.
const CLICKS = {
  open: (target) => openDrawer(target.dataset.id),
  close: closeDrawer,
  cancel: closeDrawer,
  status: (target) => toggleStatus(target.dataset.value),
  type: (target) => toggleType(target.dataset.value),
  archived: toggleArchived,
  'clear-filters': clearFilters,
  'pick-status': (target) => editDraft('status', target.dataset.value),
  'pick-type': (target) => toggleDraftType(target.dataset.value),
  create: openCreateDrawer,
  'scope-pick': backToScopeList,
  emoji: (target) => toggleEmojiPicker(target.dataset.value),
  'emoji-pick': (target) => pickEmoji(target.dataset.value),
  'new-word': (target) => toggleNewWord(target.dataset.value),
  fold: (target) => toggleFold(target.dataset.scope, target.dataset.section, target.dataset.group),
  'new-section': toggleNewSection,
  'new-subsection': (target) => toggleNewSubsection(target.dataset.section, target.dataset.where),
  'new-task': (target) => toggleNewTask(target.dataset.section, target.dataset.subsection),
  'task-add': addNewTask,
  'task-cancel': closeNewTask,
  'section-edit': (target) => openSectionDrawer(target.dataset.value),
  'subsection-edit': (target) => openSubsectionDrawer(target.dataset.section, target.dataset.value),
  'subsection-add': addNewSubsection,
  'subsection-cancel': closeNewSubsection,
  'section-add': addNewSection,
  'section-cancel': closeNewSection,
  'word-variant': (target) => pickWordVariant(target.dataset.value),
  'word-add': addNewWord,
  'word-cancel': closeNewWord,
  theme: toggleTheme,
  save: () => currentDrawer().save(),
  launch: launchSession,
  archive: archiveTask,
  sessions: toggleSessions,
  'task-start': (target) => runTaskAction('task-start', target.dataset.id),
  'task-commit': (target) => runTaskAction('task-commit', target.dataset.id),
  detach: () => (detached && !detached.closed ? detached.close() : detachWindow()),
};

const INPUTS = {
  search: (target) => setSearch(target.value),
  title: (target) => editDraft('title', target.value),
  body: (target) => editDraft('body', target.value),
  scope: (target) => pickScope(target.value),
  'scope-name': (target) => editDraft('scope', target.value),
  'emoji-search': (target) => setEmojiSearch(target.value),
  'section-name': (target) => editNewSection(target.value),
  'task-name': (target) => editNewTask(target.value),
  'section-title': (target) => editSectionDraft(target.value),
  'subsection-name': (target) => editNewSubsection(target.value),
  'subsection-title': (target) => editSubsectionDraft(target.value),
  'word-label': (target) => editNewWord('label', target.value),
  'word-hint': (target) => editNewWord('hint', target.value),
};

function bindApp() {
  const app = document.getElementById('app');
  app.addEventListener('click', (event) => {
    const target = event.target.closest('[data-act]');
    if (target && CLICKS[target.dataset.act]) CLICKS[target.dataset.act](target);
  });
  app.addEventListener('input', (event) => {
    const target = event.target.closest('[data-act]');
    if (target && INPUTS[target.dataset.act]) INPUTS[target.dataset.act](target);
  });
  app.addEventListener('change', (event) => {
    const target = event.target.closest('[data-act]');
    if (target && INPUTS[target.dataset.act]) INPUTS[target.dataset.act](target);
  });
}

function onKeydown(event) {
  if (event.key === 'Escape') closeDrawer();
}

ui.addEventListener('keydown', onKeydown);
window.addEventListener('hashchange', openFromHash);

function openFromHash() {
  const id = location.hash.match(/^#t-(\w+)$/);
  if (location.hash === '#new') openCreateDrawer();
  else if (id) openDrawer(id[1]);
  else if (drawerMode) closeDrawer();
}

applyTheme(document);
bindApp();
loadBoard().then(() => {
  restoreDetached();
  openFromHash();
});

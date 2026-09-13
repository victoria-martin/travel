let board = { tasks: [], archived: [], sections: [] };
let firstRender = true;

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

// A row has no space for labels: the emoji alone, named by its tooltip.
function typeDot(label) {
  const type = planType(label);
  return type ? `<span class="type-dot" title="${type.label}">${type.emoji}</span>` : '';
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

// The card carries its own actions, so it is a row and not a button: the clickable part that opens
// the drawer is the one inside it.
function taskButton(task) {
  const doing = task.status === DOING_STATUS;
  return `<div class="task ${doing ? 'task-doing' : ''}" data-id="${task.id}" draggable="true"
    data-section="${esc(task.section)}" data-subsection="${esc(task.subsection)}"
    aria-current="${task.id === openTaskId}">
    <button class="task-open" draggable="true" data-act="open" data-id="${task.id}">
      ${doing ? '<span class="doing-dot" aria-hidden="true"></span>' : ''}
      <span class="task-title">${esc(task.title)}</span>
      ${rowPriorityButton(task)}
      ${pill(planStatus(task.status))}
      <span class="task-types">${task.types.map(typeDot).join('')}</span>
    </button>
    ${task.session ? '<span class="task-session" title="Session liée">💬</span>' : ''}
    ${taskDoneButton(task)}
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
// Ouverte seule, la page porte en tête la flèche qui ramène à la liste complète.
const sectionTitle = (section) => `<h2 class="section-title"
  id="${anchorOf(section.name)}" ${foldAttributes('board', section.name, '')}>
  ${inView('section', section.name) ? backButton() : ''}
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

const sectionBlock = (section) => `<section class="section">
  <div class="section-head">
    ${sectionTitle(section)}
    ${showArchived ? '' : subsectionAddButton(section.name, 'board')}
  </div>
  ${isFolded('board', section.name) ? '' : sectionBody(section)}
</section>`;

// La barre latérale liste toujours tout le plan ; le panneau principal, lui, suit la vue ouverte.
function boardBody(sections) {
  if (inView('sessions')) return sessionsView();
  const shown =
    view.kind === 'section' ? sections.filter((entry) => entry.name === view.name) : sections;
  return shown.map(sectionBlock).join('') || '<p class="empty">Aucune tâche ne correspond.</p>';
}

function renderBoard() {
  settleView();
  renderToolbar();
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
  boardEl.innerHTML = boardBody(sections);
  bindTaskDrag(boardEl);
}

// Un panneau flottant se referme dès qu'on clique hors de lui — hors de tout ce qu'il porte, et
// pas seulement hors de ses boutons : son fond en fait partie.
const DISMISSED = [
  { inside: '.pill-menu', close: closePillMenu },
  { inside: '.toolbar', close: closeFilterPanel },
];

function dismissPanels(target) {
  let closed = false;
  DISMISSED.forEach((panel) => {
    if (!(target && target.closest(panel.inside)) && panel.close()) closed = true;
  });
  return closed;
}

// One listener set, on the node that travels to the detached window.
const CLICKS = {
  open: (target) => openDrawer(target.dataset.id),
  close: closeDrawer,
  cancel: closeDrawer,
  'row-priority': (target) => togglePillMenu(rowPriorityKey(target.dataset.id)),
  'row-priority-pick': (target) => setRowPriority(target.dataset.id, target.dataset.value),
  'new-task-type': () => togglePillMenu('new-task:type'),
  'new-task-priority': () => togglePillMenu('new-task:priority'),
  'new-task-status': () => togglePillMenu('new-task:status'),
  'new-task-type-pick': (target) => pickNewTaskType(target.dataset.value),
  'new-task-priority-pick': (target) => pickNewTaskPriority(target.dataset.value),
  'new-task-status-pick': (target) => pickNewTaskStatus(target.dataset.value),
  'filter-archived': toggleArchived,
  'filter-clear': clearFilters,
  'filter-panel': toggleFilterPanel,
  'filter-add': (target) => toggleFilterPicker(target.dataset.list),
  'filter-pick': (target) => addFilterWord(target.dataset.list, target.dataset.value),
  'filter-remove': (target) => removeFilterWord(target.dataset.list, target.dataset.value),
  'pick-status': (target) => editDraft('status', target.dataset.value),
  'pick-type': (target) => toggleDraftType(target.dataset.value),
  'pick-priority': (target) => toggleDraftPriority(target.dataset.value),
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
  'view-sessions': () => openView('sessions'),
  'view-section': (target) => openView('section', target.dataset.value),
  'view-subsection': (target) => openSubsectionView(target.dataset.section, target.dataset.value),
  'view-all': () => openView('all'),
  'task-done': (target) => markTaskDone(target.dataset.id),
  'close-sessions': runCloseSessions,
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
  'filter-search': (target) => setFilterSearch(target.value),
  'section-name': (target) => editNewSection(target.value),
  'task-name': (target) => editNewTask(target.value),
  'section-title': (target) => editSectionDraft(target.value),
  'subsection-name': (target) => editNewSubsection(target.value),
  'subsection-title': (target) => editSubsectionDraft(target.value),
  'word-label': (target) => editNewWord('label', target.value),
};

function bindApp() {
  const app = document.getElementById('app');
  app.addEventListener('click', (event) => {
    const target = event.target.closest('[data-act]');
    const act = target ? target.dataset.act : '';
    if (dismissPanels(event.target)) renderBoard();
    if (CLICKS[act]) CLICKS[act](target);
  });
  app.addEventListener('input', (event) => {
    const target = event.target.closest('[data-act]');
    if (target && INPUTS[target.dataset.act]) INPUTS[target.dataset.act](target);
  });
  app.addEventListener('change', (event) => {
    const target = event.target.closest('[data-act]');
    if (target && INPUTS[target.dataset.act]) INPUTS[target.dataset.act](target);
  });
  app.addEventListener('keydown', onSubmitKey);
}

// Enter is the ✓ of a typed line: the field names the act it fires, and an empty one fires
// nothing — like the button, which stays disarmed.
function onSubmitKey(event) {
  if (event.key !== 'Enter') return;
  const field = event.target.closest('[data-submit]');
  if (!field || !field.value.trim()) return;
  event.preventDefault();
  CLICKS[field.dataset.submit]();
}

function onKeydown(event) {
  if (event.key !== 'Escape') return;
  if (dismissPanels(null)) return renderBoard();
  closeDrawer();
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

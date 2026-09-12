let board = { tasks: [], archived: [] };
let activeStatuses = [];
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
    if (!needle) return true;
    return `${task.title} ${task.body} ${task.section}`.toLowerCase().includes(needle);
  });
}

function statusPill(label, attributes = '') {
  const status = planStatus(label);
  if (!status) return '';
  return `<span class="pill pill-${status.tone}" ${attributes}>${status.emoji} ${status.label}</span>`;
}

function toggleStatus(label) {
  activeStatuses = activeStatuses.includes(label)
    ? activeStatuses.filter((entry) => entry !== label)
    : [...activeStatuses, label];
  renderBoard();
}

function clearStatuses() {
  activeStatuses = [];
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
  const tally = {};
  allTasks()
    .filter((task) => Boolean(task.archived) === showArchived)
    .forEach((task) => (tally[task.status] = (tally[task.status] || 0) + 1));

  const chips = PLAN_STATUSES.map(
    (status) => `<button class="filter" data-act="status" data-value="${status.label}"
      aria-pressed="${activeStatuses.includes(status.label)}">
      ${status.emoji} ${status.label}
      <span class="tally">${tally[status.label] || 0}</span>
    </button>`,
  ).join('');

  const archived = `<button class="filter filter-archived" data-act="archived"
    aria-pressed="${showArchived}">
    📦 archivées <span class="tally">${board.archived.length}</span>
  </button>`;

  const clear = activeStatuses.length
    ? '<button class="filter-clear" data-act="clear-status">tout afficher</button>'
    : '';

  ui.getElementById('filters').innerHTML = chips + archived + clear;
}

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

// Markdown reads badly on one line: keep the words, drop the syntax.
const plainText = (markdown) =>
  markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_]/g, '')
    .replace(/^\s*-\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();

function taskButton(task) {
  return `<button class="task" data-act="open" data-id="${task.id}"
    aria-current="${task.id === openTaskId}">
    ${statusPill(task.status)}
    <span class="task-title">${esc(task.title)}</span>
    <span class="task-excerpt">${esc(plainText(task.body).slice(0, 140))}</span>
    ${task.session ? '<span class="task-session" title="Session liée">💬</span>' : ''}
  </button>`;
}

function renderBoard() {
  renderFilters();
  const tasks = visibleTasks();
  const sections = groupBySection(tasks);

  ui.getElementById('count').textContent = `${tasks.length} tâche${tasks.length > 1 ? 's' : ''}`;
  ui.getElementById('detach').hidden = !canDetach();

  ui.getElementById('sections').innerHTML = sections
    .map((section) => {
      const total = section.groups.reduce((sum, group) => sum + group.tasks.length, 0);
      return `<a href="#${anchorOf(section.name)}">
        <span>${esc(section.name)}</span><span class="tally">${total}</span>
      </a>`;
    })
    .join('');

  ui.getElementById('board').innerHTML =
    sections
      .map(
        (section) => `<section class="section">
          <h2 class="section-title" id="${anchorOf(section.name)}">${esc(section.name)}</h2>
          ${section.groups
            .map(
              (group) =>
                (group.name ? `<h3 class="group-title">${esc(group.name)}</h3>` : '') +
                group.tasks.map(taskButton).join(''),
            )
            .join('')}
        </section>`,
      )
      .join('') || '<p class="empty">Aucune tâche ne correspond.</p>';
}

// One listener set, on the node that travels to the detached window.
const CLICKS = {
  open: (target) => openDrawer(target.dataset.id),
  close: closeDrawer,
  cancel: closeDrawer,
  status: (target) => toggleStatus(target.dataset.value),
  archived: toggleArchived,
  'clear-status': clearStatuses,
  'pick-status': (target) => editDraft('status', target.dataset.value),
  save: saveDraft,
  launch: launchSession,
  archive: archiveTask,
  detach: detachWindow,
};

const INPUTS = {
  search: (target) => setSearch(target.value),
  title: (target) => editDraft('title', target.value),
  body: (target) => editDraft('body', target.value),
  prompt: (target) => setPrompt(target.value),
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
}

function onKeydown(event) {
  if (event.key === 'Escape') closeDrawer();
}

ui.addEventListener('keydown', onKeydown);
window.addEventListener('hashchange', openFromHash);

function openFromHash() {
  const id = location.hash.match(/^#t-(\w+)$/);
  if (id) openDrawer(id[1]);
  else if (openTaskId) closeDrawer();
}

bindApp();
loadBoard().then(openFromHash);

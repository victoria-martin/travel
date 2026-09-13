// A task typed at the end of the list it joins: the scope is the one it lands in, and the line
// carries the three axes it will wear. The drawer stays for the rest — the body, a rename.
let newTask = null;
let newTaskError = '';

const newTaskOpen = (section, subsection) =>
  Boolean(newTask) && newTask.section === section && newTask.subsection === subsection;

function toggleNewTask(section, subsection) {
  if (newTaskOpen(section, subsection)) return closeNewTask();
  newTask = { section, subsection, title: '', types: [], priority: '', status: NEW_STATUS };
  newTaskError = '';
  renderBoard();
  ui.getElementById('task-name').focus();
}

function closeNewTask() {
  newTask = null;
  newTaskError = '';
  closePillMenu();
  renderBoard();
}

// Typing only arms the button; re-rendering here would take the focus out of the input.
function editNewTask(value) {
  newTask.title = value;
  const add = ui.getElementById('task-add');
  if (add) add.disabled = !newTask.title.trim();
}

// A pick repaints the list, so the line takes the focus back — caret where it was left.
function renderNewTask() {
  renderBoard();
  const input = ui.getElementById('task-name');
  if (!input) return;
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
}

// A task carries several types: the menu stays open from one word to the next.
function pickNewTaskType(label) {
  newTask.types = newTask.types.includes(label)
    ? newTask.types.filter((entry) => entry !== label)
    : [...newTask.types, label];
  renderNewTask();
}

// The scale is optional: re-clicking the priority it wears takes it off again.
function pickNewTaskPriority(label) {
  newTask.priority = newTask.priority === label ? '' : label;
  closePillMenu();
  renderNewTask();
}

function pickNewTaskStatus(label) {
  newTask.status = label;
  closePillMenu();
  renderNewTask();
}

async function addNewTask() {
  try {
    board = await api('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newTask, body: '' }),
    });
    newTask = null;
    newTaskError = '';
    closePillMenu();
  } catch (error) {
    newTaskError = error.message;
  }
  renderBoard();
}

// The three axes of the line, in the order the task will wear them.
const newTaskPriorityMenu = () => {
  const key = 'new-task:priority';
  const attributes = triggerAttributes(key, 'new-task-priority', '', 'Priorité');
  return pillMenu(key, pillTrigger(planPriority(newTask.priority), attributes), () =>
    wordChoices(PLAN_PRIORITIES, 'new-task-priority-pick', (label) => newTask.priority === label),
  );
};

const newTaskStatusMenu = () => {
  const key = 'new-task:status';
  const attributes = triggerAttributes(key, 'new-task-status', '', 'Statut');
  return pillMenu(key, pillTrigger(planStatus(newTask.status), attributes), () =>
    wordChoices(PLAN_STATUSES, 'new-task-status-pick', (label) => newTask.status === label),
  );
};

const newTaskTypeMenu = () => {
  const key = 'new-task:type';
  const attributes = triggerAttributes(key, 'new-task-type', '', 'Type');
  const trigger = newTask.types.length
    ? `<span class="task-types" ${attributes}>${newTask.types.map(typeDot).join('')}</span>`
    : addTrigger(attributes);
  return pillMenu(key, trigger, () =>
    wordChoices(PLAN_TYPES, 'new-task-type-pick', (label) => newTask.types.includes(label)),
  );
};

function newTaskForm(section, subsection) {
  const scope = `data-section="${esc(section)}" data-subsection="${esc(subsection)}"`;
  if (!newTaskOpen(section, subsection)) {
    return `<button class="ghost-add" data-act="new-task" ${scope}>＋ nouvelle tâche…</button>`;
  }

  return `<div class="new-task">
    <div class="inline-form">
      <input class="new-task-input" id="task-name" data-act="task-name" data-submit="task-add"
        value="${esc(newTask.title)}" placeholder="Ce qu’il y a à faire" />
      ${newTaskPriorityMenu()}${newTaskStatusMenu()}${newTaskTypeMenu()}
      ${confirmButton('task-add', 'task-add', newTask.title.trim())}
      ${cancelButton('task-cancel')}
    </div>
    ${newTaskError ? `<p class="hint hint-warn">${esc(newTaskError)}</p>` : ''}
  </div>`;
}

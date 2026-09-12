// A task typed at the end of the list it joins: the scope is the one it lands in, and the drawer
// stays for the rest — the types, the body, a status other than the one it starts on.
let newTask = null;
let newTaskError = '';

const newTaskOpen = (section, subsection) =>
  Boolean(newTask) && newTask.section === section && newTask.subsection === subsection;

function toggleNewTask(section, subsection) {
  if (newTaskOpen(section, subsection)) return closeNewTask();
  newTask = { section, subsection, title: '' };
  newTaskError = '';
  renderBoard();
  ui.getElementById('task-name').focus();
}

function closeNewTask() {
  newTask = null;
  newTaskError = '';
  renderBoard();
}

// Typing only arms the button; re-rendering here would take the focus out of the input.
function editNewTask(value) {
  newTask.title = value;
  const add = ui.getElementById('task-add');
  if (add) add.disabled = !newTask.title.trim();
}

async function addNewTask() {
  const { section, subsection, title } = newTask;
  try {
    board = await api('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, subsection, title, types: [], status: NEW_STATUS, body: '' }),
    });
    newTask = null;
    newTaskError = '';
  } catch (error) {
    newTaskError = error.message;
  }
  renderBoard();
}

function newTaskForm(section, subsection) {
  const scope = `data-section="${esc(section)}" data-subsection="${esc(subsection)}"`;
  if (!newTaskOpen(section, subsection)) {
    return `<button class="btn btn-slim new-task-btn" data-act="new-task" ${scope}>
      ＋ nouvelle tâche…
    </button>`;
  }

  return `<div class="new-task">
    <input class="new-task-input" id="task-name" data-act="task-name" value="${esc(newTask.title)}"
      placeholder="Ce qu’il y a à faire" />
    ${newTaskError ? `<p class="hint hint-warn">${esc(newTaskError)}</p>` : ''}
    <div class="field-row">
      <button class="btn btn-primary" id="task-add" data-act="task-add"
        ${newTask.title.trim() ? '' : 'disabled'}>Ajouter</button>
      <button class="btn" data-act="task-cancel">Annuler</button>
    </div>
  </div>`;
}

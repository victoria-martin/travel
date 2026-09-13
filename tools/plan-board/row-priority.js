// The one edit a row takes on its own: its pill opens the scale under it. Everything else about a
// task goes through the drawer, but a priority is what one re-weighs while reading the list.
let priorityRow = null;

const NO_PRIORITY = { label: 'aucune', emoji: '·', variant: 'default' };

function toggleRowPriority(id) {
  priorityRow = priorityRow === id ? null : id;
  renderBoard();
}

// Tells whether it had something to put away, so the caller knows a repaint is due.
function closeRowPriority() {
  if (!priorityRow) return false;
  priorityRow = null;
  return true;
}

async function setRowPriority(id, priority) {
  priorityRow = null;
  const task = findTask(id);
  board = await api(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...task, priority }),
  });
  renderBoard();
}

const priorityChoice = (task, word, value) =>
  pill(
    word,
    `role="button" tabindex="0" data-act="row-priority-pick" data-id="${task.id}"
     data-value="${value}" aria-pressed="${task.priority === value}"`,
  );

const rowPriorityMenu = (task) =>
  priorityRow === task.id
    ? `<span class="row-priority-menu">
        ${PLAN_PRIORITIES.map((word) => priorityChoice(task, word, word.label)).join('')}
        ${priorityChoice(task, NO_PRIORITY, '')}
      </span>`
    : '';

// A row with no priority keeps its place in the rhythm: the ＋ waits for the row to be hovered.
function rowPriorityButton(task) {
  const word = planPriority(task.priority);
  const attributes = `role="button" tabindex="0" data-act="row-priority" data-id="${task.id}"
    title="Priorité" aria-pressed="${priorityRow === task.id}"`;
  return `<span class="row-priority">
    ${word ? pill(word, attributes) : `<span class="pill pill-add" ${attributes}>＋</span>`}
    ${rowPriorityMenu(task)}
  </span>`;
}

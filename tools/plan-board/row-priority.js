// The one edit a row takes on its own: its pill opens the scale under it. Everything else about a
// task goes through the drawer, but a priority is what one re-weighs while reading the list.
const NO_PRIORITY = { label: 'aucune', emoji: '·', variant: 'default' };

const rowPriorityKey = (id) => `row-priority:${id}`;

async function setRowPriority(id, priority) {
  closePillMenu();
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
  PLAN_PRIORITIES.map((word) => priorityChoice(task, word, word.label)).join('') +
  priorityChoice(task, NO_PRIORITY, '');

// A row with no priority keeps its place in the rhythm: the ＋ waits for the row to be hovered.
function rowPriorityButton(task) {
  const key = rowPriorityKey(task.id);
  const attributes = triggerAttributes(key, 'row-priority', `data-id="${task.id}"`, 'Priorité');
  return pillMenu(key, pillTrigger(planPriority(task.priority), attributes), () =>
    rowPriorityMenu(task),
  );
}

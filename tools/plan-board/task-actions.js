// Two gestures on a task besides ouvrir son tiroir : la démarrer et la clore. Aucun des deux ne
// s'exécute ici — chacun ouvre la session de la tâche dans iTerm sur la commande qui fait le
// travail, parce qu'un skill ne retrouve sa tâche que depuis sa propre session.
const TASK_ACTIONS = [
  {
    act: 'task-start',
    icon: '▶',
    prompt: START_PROMPT,
    title: (task) => (task.session ? 'Reprendre la session dans iTerm' : 'Démarrer dans iTerm'),
  },
  {
    act: 'task-commit',
    icon: '✓',
    prompt: COMMIT_PROMPT,
    title: () => 'Clore et commiter dans iTerm',
  },
];

let actionError = '';

const taskActionButtons = (task) =>
  TASK_ACTIONS.map(
    (action) => `<button class="task-action" data-act="${action.act}" data-id="${task.id}"
      title="${action.title(task)}">${action.icon}</button>`,
  ).join('');

// The panel is where the failure is readable, so a silent one opens it.
async function runTaskAction(act, id) {
  const action = TASK_ACTIONS.find((entry) => entry.act === act);
  actionError = '';
  try {
    await api(`/api/tasks/${id}/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: action.prompt }),
    });
    await loadBoard();
  } catch (error) {
    actionError = `iTerm n’a pas répondu : ${error.message}`;
    sessionsOpen = true;
  }
  renderBoard();
}

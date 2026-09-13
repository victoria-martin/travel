// Marquer une tâche terminée depuis sa ligne. Contrairement aux deux gestes d'à côté, celui-ci ne
// lance pas de session : c'est elle qui juge en cliquant, le board n'a qu'à écrire. La puce, elle,
// reste dans PLAN.md — l'en sortir est l'Archiver du tiroir, armé en deux clics.
const taskDoneButton = (task) => `<button class="task-done" data-act="task-done"
  data-id="${task.id}" title="Marquer terminée et fermer sa session">✅</button>`;

async function markTaskDone(id) {
  const task = findTask(id);
  actionError = '';
  try {
    if (task.status !== DONE_STATUS) {
      await api(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, status: DONE_STATUS }),
      });
    }
    if (task.session) await api(`/api/tasks/${id}/session`, { method: 'DELETE' });
    await loadBoard();
  } catch (error) {
    actionError = `la tâche n’a pas pu être close : ${error.message}`;
  }
  renderBoard();
}

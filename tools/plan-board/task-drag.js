// Dragging a task rewrites PLAN.md: its whole block moves where it is dropped, and a drop under
// another heading moves it to that section — the order of the file IS the order on screen.
let draggedTask = '';

async function moveTask(id, target) {
  board = await api(`/api/tasks/${id}/move`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(target),
  });
  renderBoard();
}

// A drop lands before the hovered task, or before its next neighbour past its middle — and at the
// end of the group when that neighbour is a heading or nothing. The scope is the hovered task's.
function taskDropTarget(button, clientY) {
  const anchor = overTopHalf(button, clientY) ? button : button.nextElementSibling;
  return {
    before: anchor && anchor.dataset.id ? anchor.dataset.id : '',
    section: button.dataset.section,
    subsection: button.dataset.subsection,
  };
}

// Bound once on the node itself: #board travels to the detached window with #app.
function bindTaskDrag(container) {
  if (container.dataset.drag) return;
  container.dataset.drag = 'on';

  container.addEventListener('dragstart', (event) => {
    const button = event.target.closest('.task');
    if (!button) return;
    draggedTask = button.dataset.id;
    event.dataTransfer.effectAllowed = 'move';
    button.classList.add('dragging');
  });

  container.addEventListener('dragover', (event) => {
    if (!draggedTask) return;
    event.preventDefault();
    const button = event.target.closest('.task');
    if (button) markDrop(container, button, event.clientY);
  });

  container.addEventListener('drop', (event) => {
    const button = event.target.closest('.task');
    if (!draggedTask || !button) return;
    event.preventDefault();
    const [id, target] = [draggedTask, taskDropTarget(button, event.clientY)];
    draggedTask = '';
    markDrop(container, null);
    if (id !== target.before) moveTask(id, target);
  });

  container.addEventListener('dragend', () => {
    draggedTask = '';
    markDrop(container, null);
  });
}

// A step is dragged by its handle, so the inline-edited title stays selectable. The hovered card
// wears the line where the step will land, above or below it.
let draggedStep = '';

function stepDragHandle(step) {
  return /* HTML */ `<span
    class="step-drag-handle"
    draggable="true"
    title="Glisser pour déplacer"
    ondragstart="startStepDrag(event,'${step.id}')"
    ondragend="endStepDrag()"
    >⠿</span
  >`;
}

function startStepDrag(event, stepId) {
  draggedStep = stepId;
  const card = event.target.closest('.step-card');
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setDragImage(card, 24, 20);
  card.classList.add('step-dragging');
}

function overStepCard(event) {
  if (!draggedStep) return;
  event.preventDefault();
  markDrop(event.currentTarget, event.clientY, 'step-drop-before', 'step-drop-after');
}

function dropOnStepCard(event, scenarioId, stepId) {
  if (!draggedStep) return;
  event.preventDefault();
  const [dragged, before] = [draggedStep, overTopHalf(event.currentTarget, event.clientY)];
  endStepDrag();
  moveStepBefore(scenarioId, dragged, stepId, before);
}

function endStepDrag() {
  draggedStep = '';
  markDrop(null, 0, 'step-drop-before', 'step-drop-after');
  document
    .querySelectorAll('.step-dragging')
    .forEach((card) => card.classList.remove('step-dragging'));
}

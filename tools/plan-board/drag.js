// Drag reordering, shared by the section list and the task board: the hovered element wears the
// line where the drop will land, above or below it.
const overTopHalf = (element, clientY) => {
  const box = element.getBoundingClientRect();
  return clientY < box.top + box.height / 2;
};

function markDrop(container, element, clientY) {
  container
    .querySelectorAll('.drop-before, .drop-after, .dragging')
    .forEach((marked) => marked.classList.remove('drop-before', 'drop-after', 'dragging'));
  if (element) element.classList.add(overTopHalf(element, clientY) ? 'drop-before' : 'drop-after');
}

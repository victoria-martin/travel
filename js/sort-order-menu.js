/*
  The direction of a dictionary level is its vocabulary, laid out in the order the reader wants:
  reversing it has no meaning, rearranging it does. The dragged word lives in a global, and the
  dictionary it belongs to is read back from its column at the drop.
*/
let draggedSortWord = '';

function startSortWordDrag(event, word) {
  draggedSortWord = word;
  event.dataTransfer.effectAllowed = 'move';
  event.currentTarget.classList.add('sort-order-dragging');
}

function overSortWord(event) {
  if (!draggedSortWord) return;
  event.preventDefault();
  markDrop(event.currentTarget, event.clientY, 'sort-order-drop-before', 'sort-order-drop-after');
}

function dropOnSortWord(event, kind, columnKey, word) {
  if (!draggedSortWord) return;
  event.preventDefault();
  const [dragged, before] = [draggedSortWord, overTopHalf(event.currentTarget, event.clientY)];
  endSortWordDrag();
  const column = columnsFor(kind).find((c) => c.key === columnKey);
  moveSortOrderWord(column.sortOrder, dragged, word, before);
}

function endSortWordDrag() {
  draggedSortWord = '';
  markDrop(null, 0, 'sort-order-drop-before', 'sort-order-drop-after');
  document
    .querySelectorAll('.sort-order-dragging')
    .forEach((word) => word.classList.remove('sort-order-dragging'));
}

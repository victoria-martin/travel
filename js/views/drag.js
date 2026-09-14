/*
  Two lists are rearranged by dragging — the steps of a scenario, the words of a sort order. The
  hovered element wears the line where the dragged one will land, above or below it.
*/

function overTopHalf(element, clientY) {
  const box = element.getBoundingClientRect();
  return clientY < box.top + box.height / 2;
}

function markDrop(element, clientY, beforeClass, afterClass) {
  document
    .querySelectorAll(`.${beforeClass}, .${afterClass}`)
    .forEach((marked) => marked.classList.remove(beforeClass, afterClass));
  if (element) element.classList.add(overTopHalf(element, clientY) ? beforeClass : afterClass);
}

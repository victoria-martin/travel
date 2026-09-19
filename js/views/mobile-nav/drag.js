// Glisser une ligne du tiroir Plus en mode réorganisation, sur le patron de step-drag.js — la
// ligne survolée porte le trait de dépôt via markDrop/overTopHalf (js/views/drag.js).
let mobileNavDraggedKey = '';

function startMobileNavDrag(event, key) {
  mobileNavDraggedKey = key;
  const row = event.currentTarget.closest('.mobile-nav-reorder-row');
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setDragImage(row, 16, 16);
  row.classList.add('mobile-nav-row-dragging');
}

function overMobileNavRow(event) {
  if (!mobileNavDraggedKey) return;
  event.preventDefault();
  markDrop(event.currentTarget, event.clientY, 'mobile-nav-drop-before', 'mobile-nav-drop-after');
}

function dropOnMobileNavRow(event, targetKey) {
  if (!mobileNavDraggedKey) return;
  event.preventDefault();
  const [dragged, before] = [mobileNavDraggedKey, overTopHalf(event.currentTarget, event.clientY)];
  endMobileNavDrag();
  moveMobileNavItemBefore(dragged, targetKey, before);
}

function endMobileNavDrag() {
  mobileNavDraggedKey = '';
  markDrop(null, 0, 'mobile-nav-drop-before', 'mobile-nav-drop-after');
  document
    .querySelectorAll('.mobile-nav-row-dragging')
    .forEach((row) => row.classList.remove('mobile-nav-row-dragging'));
}

// Dragging in the sidebar rewrites PLAN.md: a `##` block or a `###` block moves whole, tasks
// included, because the order of the file IS the order on screen. Two kinds travel through the
// same listeners, told apart by the row that started the drag.
let dragged = null;

async function moveSection(name, before) {
  if (!name || name === before) return;
  board = await api('/api/sections', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, before }),
  });
  renderBoard();
}

async function moveSubsection(from, target) {
  board = await api('/api/subsections', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...from, ...target }),
  });
  renderBoard();
}

const rowsOf = (container, selector) => [...container.querySelectorAll(selector)];

// A drop lands before the hovered row, or before its next neighbour past its middle — and at the
// end of the list when that neighbour is nothing at all.
function nextRow(container, selector, row) {
  const rows = rowsOf(container, selector);
  return rows[rows.indexOf(row) + 1] || null;
}

// A section drops before another section; past the last one it lands at the end of the list.
function sectionTarget(container, row, clientY) {
  const anchor = overTopHalf(row, clientY) ? row : nextRow(container, '.section-link', row);
  return { before: anchor ? anchor.dataset.section : '' };
}

// A subsection drops before another group — of its page or of any other. Dropped on a page title
// it lands at the top of that page, ahead of the first group it already holds.
function subsectionTarget(container, row, clientY) {
  if (row.classList.contains('section-link')) {
    const first = row.parentElement.querySelector('.subsection-link');
    return { toSection: row.dataset.section, before: first ? first.dataset.subsection : '' };
  }
  const anchor = overTopHalf(row, clientY) ? row : nextRow(container, '.subsection-link', row);
  const same = anchor && anchor.dataset.section === row.dataset.section;
  return {
    toSection: row.dataset.section,
    before: same ? anchor.dataset.subsection : '',
  };
}

const hoveredRow = (event, kind) =>
  event.target.closest(kind === 'section' ? '.section-link' : '.section-link, .subsection-link');

// Bound once on the node itself: #sections travels to the detached window with #app.
function bindSidebarDrag(container) {
  if (container.dataset.drag) return;
  container.dataset.drag = 'on';

  container.addEventListener('dragstart', (event) => {
    const row = event.target.closest('.section-link, .subsection-link');
    if (!row) return;
    const kind = row.dataset.subsection ? 'subsection' : 'section';
    dragged = { kind, section: row.dataset.section, name: row.dataset.subsection || '' };
    event.dataTransfer.effectAllowed = 'move';
    row.classList.add('dragging');
  });

  container.addEventListener('dragover', (event) => {
    if (!dragged) return;
    const row = hoveredRow(event, dragged.kind);
    if (!row) return;
    event.preventDefault();
    markDrop(container, row, event.clientY);
  });

  container.addEventListener('drop', (event) => {
    const row = dragged && hoveredRow(event, dragged.kind);
    if (!row) return;
    event.preventDefault();
    const moving = dragged;
    dragged = null;
    markDrop(container, null);
    if (moving.kind === 'section') {
      moveSection(moving.section, sectionTarget(container, row, event.clientY).before);
    } else {
      moveSubsection(
        { section: moving.section, name: moving.name },
        subsectionTarget(container, row, event.clientY),
      );
    }
  });

  container.addEventListener('dragend', () => {
    dragged = null;
    markDrop(container, null);
  });
}

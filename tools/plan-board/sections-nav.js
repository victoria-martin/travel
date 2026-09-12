// The sidebar list of sections. Dragging one rewrites the order of the `##` blocks of PLAN.md.
let draggedSection = '';

async function moveSection(name, before) {
  if (!name || name === before) return;
  board = await api('/api/sections', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, before }),
  });
  renderBoard();
}

// A drop lands before the hovered section, or after it past its middle — the anchor is then its
// next neighbour, and nothing at all when it is the last one, the creation form closing the list.
function dropAnchor(link, clientY) {
  if (overTopHalf(link, clientY)) return link.dataset.section;
  const next = link.nextElementSibling;
  return (next && next.dataset.section) || '';
}

// Bound once on the node itself: #sections travels to the detached window with #app.
function bindSectionDrag(container) {
  if (container.dataset.drag) return;
  container.dataset.drag = 'on';

  container.addEventListener('dragstart', (event) => {
    const link = event.target.closest('[data-section]');
    if (!link) return;
    draggedSection = link.dataset.section;
    event.dataTransfer.effectAllowed = 'move';
    link.classList.add('dragging');
  });

  container.addEventListener('dragover', (event) => {
    if (!draggedSection) return;
    event.preventDefault();
    const link = event.target.closest('[data-section]');
    if (link) markDrop(container, link, event.clientY);
  });

  container.addEventListener('drop', (event) => {
    const link = event.target.closest('[data-section]');
    if (!draggedSection || !link) return;
    event.preventDefault();
    const [name, before] = [draggedSection, dropAnchor(link, event.clientY)];
    draggedSection = '';
    markDrop(container, null);
    moveSection(name, before);
  });

  container.addEventListener('dragend', () => {
    draggedSection = '';
    markDrop(container, null);
  });
}

// The list is the order of the `##` headings of PLAN.md, a freshly created one included: a section
// without any visible task shows up with an empty tally rather than disappearing. Its emoji is the
// handle that opens the section drawer; the rest of the row scrolls to the block.
function renderSections(visible) {
  const tallyOf = (name) => {
    const section = visible.find((entry) => entry.name === name);
    if (!section) return 0;
    return section.groups.reduce((sum, group) => sum + group.tasks.length, 0);
  };

  const container = ui.getElementById('sections');
  container.innerHTML =
    board.sections
      .map(
        (section) => `<div class="section-link" draggable="true"
        data-section="${esc(section.name)}">
        <button class="section-emoji" data-act="section-edit" data-value="${esc(section.name)}"
          title="Emoji et nom de la section">${section.emoji || '·'}</button>
        <a href="#${anchorOf(section.name)}">
          <span>${esc(section.name)}</span><span class="tally">${tallyOf(section.name)}</span>
        </a>
      </div>`,
      )
      .join('') + newSectionForm();
  bindSectionDrag(container);
}

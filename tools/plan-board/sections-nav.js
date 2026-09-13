// The sidebar is the skeleton of PLAN.md: the `##` pages in the order of the file, each with the
// `###` groups it holds. A section without any visible task shows up with an empty tally rather
// than disappearing — nothing there can be filtered out, and it is where the first one gets typed.
// The emoji is the handle that opens the section drawer; the rest of the row opens the page alone
// in the main panel.
function sectionRow(section, tally) {
  return `<div class="section-link" draggable="true" data-section="${esc(section.name)}">
    <button class="section-fold" ${foldAttributes('nav', section.name, '')}>${chevron()}</button>
    <button class="section-emoji" data-act="section-edit" data-value="${esc(section.name)}"
      title="Emoji et nom de la section">${section.emoji || '·'}</button>
    <button class="section-name" data-act="view-section" data-value="${esc(section.name)}"
      aria-pressed="${inView('section', section.name)}">${esc(section.name)}</button>
    ${showArchived ? '' : subsectionAddButton(section.name, 'nav')}
    <span class="tally">${tally}</span>
  </div>`;
}

function subsectionRow(section, name, tally) {
  return `<div class="subsection-link" draggable="true" data-section="${esc(section.name)}"
    data-subsection="${esc(name)}">
    <button class="subsection-edit" data-act="subsection-edit" data-section="${esc(section.name)}"
      data-value="${esc(name)}" title="Renommer le groupe">✎</button>
    <button class="subsection-name" data-act="view-subsection" data-section="${esc(section.name)}"
      data-value="${esc(name)}">
      <span>${esc(name)}</span><span class="tally">${tally}</span>
    </button>
  </div>`;
}

function renderSections(visible) {
  const groupsOf = (name) => {
    const section = visible.find((entry) => entry.name === name);
    return section ? section.groups : [];
  };
  const tallyOf = (groups, name) => {
    const group = groups.find((entry) => entry.name === name);
    return group ? group.tasks.length : 0;
  };

  const container = ui.getElementById('sections');
  container.innerHTML =
    sessionsNav() +
    board.sections
      .map((section) => {
        const groups = groupsOf(section.name);
        const total = groups.reduce((sum, group) => sum + group.tasks.length, 0);
        return `<div class="section-block">
          ${sectionRow(section, total)}
          ${
            isFolded('nav', section.name)
              ? ''
              : `${section.subsections
                  .map((name) => subsectionRow(section, name, tallyOf(groups, name)))
                  .join('')}
                ${showArchived ? '' : newSubsectionForm(section.name, 'nav')}`
          }
        </div>`;
      })
      .join('') +
    newSectionForm();
  bindSidebarDrag(container);
}

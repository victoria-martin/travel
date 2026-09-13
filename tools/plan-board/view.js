// Le panneau principal ne montre qu'une liste à la fois : tout le backlog, une page, ou les
// sessions ouvertes. C'est une préférence de vue comme le repli — le board se recharge à chaque
// enregistrement, et la liste ouverte ne doit pas se refermer derrière nous.
const VIEW_KEY = 'plan-board-view';
const ALL_VIEW = { kind: 'all', name: '' };

let view = (() => {
  try {
    return JSON.parse(localStorage.getItem(VIEW_KEY)) || ALL_VIEW;
  } catch {
    return ALL_VIEW;
  }
})();

const inView = (kind, name = '') => view.kind === kind && view.name === name;

function openView(kind, name = '') {
  view = { kind, name };
  try {
    localStorage.setItem(VIEW_KEY, JSON.stringify(view));
  } catch {
    // A blocked store only costs the preference.
  }
  renderBoard();
}

// Une page renommée ou disparue emporte sa vue : on retombe sur la liste complète.
function settleView() {
  if (view.kind === 'section' && !board.sections.some((entry) => entry.name === view.name)) {
    view = ALL_VIEW;
  }
}

// Ouvrir un groupe, c'est ouvrir sa page et s'y poser : un `###` n'est pas une vue à lui.
function openSubsectionView(section, name) {
  openView('section', section);
  const anchor = ui.getElementById(subAnchorOf(section, name));
  if (anchor) anchor.scrollIntoView({ block: 'start' });
}

// La flèche est le seul retour : une vue ne s'empile pas, elle remplace la précédente.
const backButton = () => `<button class="view-back" data-act="view-all"
  title="Toutes les pages">←</button>`;

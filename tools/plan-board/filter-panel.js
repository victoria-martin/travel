// Le bouton de la barre et le panneau qu'il déplie. Deux listes de pastilles, chacune avec son ＋
// qui ouvre le vocabulaire : le panneau ne fait donc jamais la taille des trente mots, mais celle
// de ce qui est posé.
let filterOpen = false;
let filterPicker = '';
let filterSearch = '';

function toggleFilterPanel() {
  if (!closeFilterPanel()) filterOpen = true;
  renderBoard();
}

// Dit s'il avait quelque chose à replier, pour que l'appelant sache qu'un repeint est dû.
function closeFilterPanel() {
  if (!filterOpen) return false;
  filterOpen = false;
  closeFilterPicker();
  return true;
}

function closeFilterPicker() {
  filterPicker = '';
  filterSearch = '';
}

// Le champ de recherche naît avec le picker : le focus s'y pose une fois le panneau repeint.
function toggleFilterPicker(name) {
  const reopening = filterPicker !== name;
  closeFilterPicker();
  if (reopening) filterPicker = name;
  renderToolbar();
  const field = ui.getElementById('filter-search');
  if (field) field.focus();
}

// Seule la grille se repeint : repeindre le panneau sortirait le focus du champ.
function setFilterSearch(value) {
  filterSearch = value;
  renderFilterChoices();
}

// Les trois vocabulaires d'un seul tenant : la pastille porte sa couleur, elle dit à quel axe elle
// appartient sans qu'on ait à choisir l'axe d'abord. Un mot déjà posé n'est plus proposé.
const pickableWords = () => {
  const needle = filterSearch.trim().toLowerCase();
  return FILTER_AXES.flatMap((axis) => axis.words()).filter(
    (word) =>
      !included.includes(word.label) &&
      !excluded.includes(word.label) &&
      word.label.toLowerCase().includes(needle),
  );
};

function filterChoices() {
  const tallies = wordTallies();
  return (
    pickableWords()
      .map(
        (word) => `<button class="filter-choice" data-act="filter-pick"
          data-list="${filterPicker}" data-value="${esc(word.label)}">
          ${pill(word)}<span class="tally">${tallies[word.label] || 0}</span>
        </button>`,
      )
      .join('') || '<p class="hint">Aucun mot pour cette recherche.</p>'
  );
}

function renderFilterChoices() {
  const grid = ui.getElementById('filter-choices');
  if (grid) grid.innerHTML = filterChoices();
}

const filterPickerPanel = () => `<div class="filter-picker">
  <input class="filter-search" id="filter-search" data-act="filter-search"
    value="${esc(filterSearch)}" placeholder="Chercher : statut, type, priorité…" />
  <div class="filter-choices" id="filter-choices">${filterChoices()}</div>
</div>`;

const filterWordPill = (name, label) => `<span class="filter-word">
  ${pill(filterWord(label))}
  <button class="filter-remove" data-act="filter-remove" data-list="${name}"
    data-value="${esc(label)}" title="Enlever ce filtre">✕</button>
</span>`;

function filterList(name) {
  const list = FILTER_LISTS[name];
  return `<div class="filter-block">
    <p class="filter-title">${list.title}</p>
    <div class="choices">
      ${list
        .words()
        .map((label) => filterWordPill(name, label))
        .join('')}
      <span class="pill pill-add" role="button" tabindex="0" data-act="filter-add"
        data-list="${name}" aria-pressed="${filterPicker === name}" title="Ajouter un mot">＋</span>
    </div>
    ${filterPicker === name ? filterPickerPanel() : ''}
  </div>`;
}

// Les archivées ne sont pas un mot du vocabulaire mais l'autre collection : d'où la bascule au pied
// du panneau, hors des deux listes.
const archivedToggle = () => `<button class="filter-archived" data-act="filter-archived"
  aria-pressed="${showArchived}">
  📦 archivées <span class="tally">${board.archived.length}</span>
</button>`;

function filterPanel() {
  if (!filterOpen) return '';
  return `<div class="filter-panel">
    <div class="filter-panel-head">
      <span>Filtrer</span>
      ${
        filterCount()
          ? '<button class="filter-clear" data-act="filter-clear">tout afficher</button>'
          : ''
      }
    </div>
    ${filterList('include')}
    ${filterList('exclude')}
    <div class="filter-foot">${archivedToggle()}</div>
  </div>`;
}

// La barre est au-dessus de la liste : ce qui est filtré l'est dans toutes les vues.
function renderToolbar() {
  const count = filterCount();
  ui.getElementById('toolbar').innerHTML =
    `<button class="ghost-btn" data-act="filter-panel" aria-pressed="${filterOpen}">
      ▽ Filtrer${count ? `<span class="filter-count">${count}</span>` : ''}
    </button>` + filterPanel();
}

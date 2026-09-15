/*
  Une pastille qu'on garde ou qu'on lâche : on filtre en cliquant ce que la liste montre déjà.
*/
function filterPill({ label, active, onclick }) {
  return /* HTML */ `<button class="filter-pill ${active ? 'active' : ''}" onclick="${onclick}">
    ${label}
  </button>`;
}

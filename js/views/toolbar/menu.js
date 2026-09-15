// Les réglages communs à toutes les listes ; une vue y ajoute les siens.
function toolbarMenu(viewOptions = '') {
  return toolbarPanel({
    key: 'menu',
    icon: '⋮',
    label: 'Affichage',
    body: /* HTML */ `<div class="filter-block">
        <p class="filter-title">Affichage</p>
        ${buttonLabelsOption()}
      </div>
      ${viewOptions}`,
  });
}

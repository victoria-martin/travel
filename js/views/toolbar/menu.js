function toolbarMenu() {
  return toolbarPanel({
    key: 'menu',
    icon: '⋮',
    label: 'Affichage',
    body: /* HTML */ `<div class="filter-block">
      <p class="filter-title">Affichage</p>
      ${buttonLabelsOption()}
    </div>`,
  });
}

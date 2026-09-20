// Le ⋮ d'une liste ouvre les mêmes réglages que la barre latérale, sans quitter l'écran.
function toolbarMenu() {
  return toolbarPanel({
    key: 'menu',
    icon: svgIcon('ellipsis-vertical'),
    label: 'Affichage',
    body: settingsBlocks(),
    wide: true,
  });
}

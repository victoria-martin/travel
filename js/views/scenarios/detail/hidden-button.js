/*
  Masquer met l'étape — ou le groupe entier, colonnes comprises — hors des dates, des totaux et de
  la carte ; elle reste dans la liste, hachurée. L'œil dit l'état et non le geste : barré, c'est
  qu'on ne la voit plus.
*/
function hiddenButton(hidden, onclick) {
  return /* HTML */ `<button
    class="icon-btn"
    onclick="${onclick}"
    title="${
      hidden
        ? 'Afficher — la remettre dans le voyage'
        : 'Masquer — hors des dates, des totaux et de la carte'
    }"
  >
    ${svgIcon(hidden ? 'eye-off' : 'eye')}
  </button>`;
}

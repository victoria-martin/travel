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
    ${eyeIcon(hidden)}
  </button>`;
}

function eyeIcon(crossed) {
  return /* HTML */ `<svg class="eye-icon" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M1 8s2.6-4.3 7-4.3 7 4.3 7 4.3-2.6 4.3-7 4.3S1 8 1 8Z" />
    <circle cx="8" cy="8" r="1.9" />
    ${crossed ? '<line x1="2.6" y1="13.4" x2="13.4" y2="2.6" />' : ''}
  </svg>`;
}

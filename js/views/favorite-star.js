function favoriteStar(isFavorite, onclick) {
  return /* HTML */ `<button
    class="icon-btn"
    style="border:none; font-size:16px; flex-shrink:0; color:${isFavorite ? '#C98A3E' : 'var(--line)'};"
    onclick="${onclick}"
    title="${isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}"
  >
    ${isFavorite ? '★' : '☆'}
  </button>`;
}

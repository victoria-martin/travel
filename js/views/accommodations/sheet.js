/*
  La fiche d'un hébergement : le formulaire de la modale, posé en panneau de droite. Elle s'ouvre
  d'une ligne du tableau et du ↗ d'un hébergement dans le menu de lieu d'une étape — deux endroits
  d'où l'on veut lire et corriger la fiche sans quitter ce qu'on fait. L'ajout garde la modale.
*/
function openAccommodationSheet(id) {
  closeOpenInlineMenu();
  openSheet('accommodation', id);
}

ROW_CLICKS.hebergements = openAccommodationSheet;

function accommodationSheetButton(id) {
  return /* HTML */ `<button
    class="sheet-btn"
    title="Ouvrir la fiche"
    onclick="openAccommodationSheet('${id}')"
  >
    ${svgIcon('arrow-up-right')}
  </button>`;
}

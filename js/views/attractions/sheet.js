/*
  La fiche d'un lieu : le formulaire de la modale, posé en panneau de droite, comme celle d'un
  hébergement — même gabarit de tableau (23 colonnes), même besoin de la lire sans la dérouler.
  L'ajout garde la modale.
*/
function openAttractionSheet(id) {
  closeOpenInlineMenu();
  openSheet('attraction', id);
}

ROW_CLICKS.attractions = openAttractionSheet;

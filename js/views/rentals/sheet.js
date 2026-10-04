/*
  La fiche d'une offre : le formulaire de la modale, posé en panneau de droite, comme celle d'un
  hébergement — dix-sept colonnes dans le tableau des Offres, difficile à lire ligne par ligne.
  L'ajout garde la modale.
*/
function openOfferSheet(id) {
  closeOpenInlineMenu();
  openSheet('voiture', id);
}

ROW_CLICKS.locations = openOfferSheet;

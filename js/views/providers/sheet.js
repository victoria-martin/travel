/*
  La fiche d'un prestataire : le formulaire de la modale, posé en panneau de droite, comme celle
  d'un hébergement. Elle s'ouvre d'une ligne du tableau — on lit et corrige un loueur sans quitter
  la liste. L'ajout et la reprise en cours de saisie gardent la modale.
*/
function openProviderSheet(id) {
  openSheet('prestataire', id);
}

ROW_CLICKS.prestataires = openProviderSheet;

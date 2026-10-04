/*
  Bloc de localisation partagé par les modales hébergement, ville et activité : une seule modale est
  ouverte à la fois, les ids sont donc fixes. Les quatre niveaux viennent de `PLACE_LEVELS`, par
  rangées de deux.
*/
/*
  Existing values from every located collection, so a place can reuse one or introduce its own.
  La ville est la seule à avoir sa propre db (villes.js) : elle propose ce qu'elle contient plutôt
  que de re-dériver les attractions/hébergements.
*/
function locateSummary(p) {
  if (p.lat && p.lng) return `📍 ${placeLevelsLabel(p) || 'Position enregistrée'}`;
  if (p.address) return '⚠️ Aucune position — clique sur Localiser, ou saisis les coordonnées.';
  return "Localise une adresse, ou saisis les coordonnées si l'endroit est imprécis.";
}

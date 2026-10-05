/*
  Fiche minimale : nom + position. Pas de champs d'attraction (favoris, tags, statut…) — une ville
  n'en a pas. La recherche reprend le geste de NewCityButton (src/domains/carte/MapView/NewCityButton.tsx) (taper, choisir un résultat), mais les
  coordonnées choisies vivent dans modal.payload le temps de la saisie, comme les autres champs
  sans <input> dédié (ex. searchDate d'un hébergement).
*/
// Formulaire : src/domains/villes/modal/VilleModal.tsx (docs/en-cours/react-migration-plan.md § 4).

function villeGeocodeSummary(p) {
  if (p.lat && p.lng) return '📍 Positionnée';
  return '⚠️ Pas encore localisée — clique sur Localiser, ou saisis les coordonnées.';
}

/*
  La recherche d'une attraction, partagée par le champ de la modale d'étape et le ＋ d'une carte :
  les correspondances du voyage courant hors celles déjà attachées, et la création du nom tapé.
  Chacun rend sa propre liste : la modale en résultats, la carte en items de menu déroulant.
*/

function attractionMatches(query, usedIds) {
  const needle = query.toLowerCase();
  return ofCurrentTravel(state.attractions)
    .filter((a) => !usedIds.includes(a.id) && (a.name || '').toLowerCase().includes(needle))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Une attraction créée ici ne porte que son nom : le reste se complète depuis la page À faire.
function createAttractionNamed(name) {
  const item = { ...emptyAttraction(), id: uid(), travelId: currentTravelId(), name };
  upsertAttraction(item);
  showToast('Lieu créé');
  return item;
}

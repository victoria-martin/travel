/*
  L'id se dérive du nom, comme pour les prestataires ou les modèles de voiture : une ville créée à
  la main sous le même nom qu'une ville déjà upsert depuis une attraction/hébergement fusionne avec
  elle plutôt que d'en doubler une deuxième entrée. Renommer une ville existante garde son id.
*/
function readVilleForm(id) {
  const name = document.getElementById('ville-name').value.trim() || 'Sans nom';
  const travelId = modal.payload.travelId || currentTravelId();
  return {
    id: id || villeIdFromName(travelId, name),
    travelId,
    name,
    lat: document.getElementById('ville-lat').value.trim(),
    lng: document.getElementById('ville-lng').value.trim(),
  };
}

function saveVille(id) {
  upsertVille(readVilleForm(id));
  closeModal();
}

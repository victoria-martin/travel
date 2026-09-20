function emptyVille() {
  return { id: '', travelId: '', name: '', lat: '', lng: '' };
}

function getVille(id) {
  return state.villes.find((v) => v.id === id);
}

function villeIdFromName(travelId, name) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `ville-${travelId}-${slug}`;
}

/*
  Le nom tapé dans un champ ville (attraction/hébergement) fait exister la ville dans la db, sans
  rien demander : aucune coordonnée n'est requise pour l'upsert. Le géocodage se tente ensuite en
  tâche de fond, best-effort — s'il échoue, la ville reste dans la liste sans position, sans marker
  sur la carte, exactement comme un lieu qu'on n'a pas encore localisé.
*/
function upsertVilleByName(travelId, name) {
  const trimmed = (name || '').trim();
  if (!trimmed) return null;
  const id = villeIdFromName(travelId, trimmed);
  const existing = state.villes.find((v) => v.id === id);
  if (existing) return existing;
  const ville = { id, travelId, name: trimmed, lat: '', lng: '' };
  state.villes.push(ville);
  saveNow();
  geocodeVilleInBackground(ville.id);
  return ville;
}

async function geocodeVilleInBackground(id) {
  const ville = getVille(id);
  if (!ville) return;
  const match = (await geocodeCandidates(ville.name))[0];
  const current = getVille(id);
  if (!match || !current || current.lat) return;
  current.lat = match.lat;
  current.lng = match.lng;
  saveNow();
  render();
}

function upsertVille(item) {
  const idx = state.villes.findIndex((v) => v.id === item.id);
  if (idx === -1) state.villes.push(item);
  else state.villes[idx] = item;
  saveNow();
}

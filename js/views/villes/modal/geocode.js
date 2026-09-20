async function locateVille() {
  const name = document.getElementById('ville-name').value.trim();
  modal.payload.name = name;
  if (!name) {
    modal.payload.status = 'Renseigne un nom de ville à localiser.';
    return render();
  }
  modal.payload.status = '⏳ Localisation…';
  render();
  modal.payload.matches = await geocodeCandidates(name);
  modal.payload.status = modal.payload.matches.length
    ? 'Choisis le bon résultat :'
    : '⚠️ Introuvable — saisis les coordonnées à la main.';
  render();
}

// Le nom retenu est celui du résultat, pas celui tapé : « sienne » se pose en « Siena ».
function applyVilleMatch(index) {
  const match = modal.payload.matches[index];
  if (!match) return;
  document.getElementById('ville-name').value = match.city || modal.payload.name;
  modal.payload.name = match.city || modal.payload.name;
  modal.payload.lat = match.lat;
  modal.payload.lng = match.lng;
  modal.payload.matches = [];
  modal.payload.status = `📍 ${escapeHtml(modal.payload.name)} — position choisie`;
  render();
}

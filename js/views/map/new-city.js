/*
  Une ville se crée depuis la carte, là où on voit le trou : on tape son nom, on choisit le bon
  résultat du géocodage, la pastille se pose — upsert direct dans la db villes, avec les coords du
  résultat choisi plutôt que le géocodage best-effort de `upsertVilleByName`. Le brouillon vit dans
  une globale et non dans le DOM : chaque étape rend la page — la carte se retrace au même moment —
  et un champ perdrait ce qu'on y a tapé.
*/
const NEW_CITY_HELP = 'Tape une ville, puis localise-la.';

let cityDraft = emptyCityDraft();

function emptyCityDraft() {
  return { address: '', matches: [], status: NEW_CITY_HELP };
}

function newCityPanel() {
  return toolbarPanel({
    key: 'new-city',
    icon: svgIcon('plus'),
    label: 'Ville',
    body: /* HTML */ `<div class="new-city">
      <div class="locate-row">
        <input
          id="new-city-address"
          type="text"
          value="${escapeHtml(cityDraft.address)}"
          placeholder="Nom de la ville"
          onkeydown="newCityKeydown(event)"
        />
        <button type="button" class="btn btn-ghost btn-small" onclick="locateNewCity()">
          Localiser
        </button>
      </div>
      <div class="geocode-status">${cityDraft.status}</div>
      <div class="geocode-matches">
        ${cityDraft.matches
          .map(
            (m, i) =>
              `<button type="button" class="geocode-match" onclick="createCityFromMatch(${i})">${escapeHtml(m.label)}</button>`,
          )
          .join('')}
      </div>
    </div>`,
  });
}

function newCityKeydown(event) {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  locateNewCity();
}

async function locateNewCity() {
  cityDraft.address = document.getElementById('new-city-address').value.trim();
  cityDraft.matches = [];
  if (!cityDraft.address) {
    cityDraft.status = 'Renseigne une ville à localiser.';
    return render();
  }
  cityDraft.status = '⏳ Localisation…';
  render();
  cityDraft.matches = await geocodeCandidates(cityDraft.address);
  cityDraft.status = cityDraft.matches.length
    ? 'Choisis le bon résultat :'
    : '⚠️ Introuvable — ajoute-la depuis la page Lieux.';
  render();
}

// Le nom est celui du résultat, pas celui qu'on a tapé : « sienne » se pose en « Siena ».
function createCityFromMatch(index) {
  const match = cityDraft.matches[index];
  if (!match) return;
  const name = match.city || cityDraft.address;
  const id = villeIdFromName(currentTravelId(), name);
  upsertVille({ id, travelId: currentTravelId(), name, lat: match.lat, lng: match.lng });
  cityDraft = emptyCityDraft();
  cityDraft.status = `📍 ${escapeHtml(name)} ajoutée`;
  render();
}

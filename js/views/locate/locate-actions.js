let geocodeMatches = [];

async function locateAddress() {
  const address = document.getElementById('geo-address').value.trim();
  if (!address) {
    setGeocodeStatus('Renseigne une adresse à localiser.', false);
    return;
  }
  setGeocodeStatus("⏳ Localisation de l'adresse…", true);
  geocodeMatches = await geocodeCandidates(address);
  setGeocodeStatus(
    geocodeMatches.length
      ? 'Choisis le bon résultat :'
      : '⚠️ Introuvable — saisis les coordonnées à la main.',
    false,
  );
  renderGeocodeMatches();
}

function renderGeocodeMatches() {
  const box = document.getElementById('geocode-matches');
  if (!box) return;
  box.innerHTML = geocodeMatches
    .map(
      (m, i) =>
        `<button type="button" class="geocode-match" onclick="applyGeocodeMatch(${i})">${escapeHtml(m.label)}</button>`,
    )
    .join('');
}

function applyGeocodeMatch(index) {
  const match = geocodeMatches[index];
  if (!match) return;
  ['lat', 'lng', ...PLACE_LEVEL_KEYS].forEach((key) => {
    document.getElementById(`geo-${key}`).value = match[key] || '';
  });
  geocodeMatches = [];
  saveLocatedForm();
  setGeocodeStatus(`📍 ${placeLevelsLabel(match) || match.label} — enregistré`, false);
}

const LOCATED_FORMS = {
  accommodation: {
    read: (id) => readAccommodationForm(id),
    upsert: (item) => upsertAccommodation(item),
  },
  ville: { read: (id) => readCityForm(id), upsert: (item) => upsertCity(item) },
};

/* A found position is worth keeping right away: the record is written, the modal stays on it. */
function saveLocatedForm() {
  const form = LOCATED_FORMS[modal.type];
  if (!form) return;
  const item = form.read(modal.payload.id);
  form.upsert(item);
  modal.payload = item;
  render();
}

function readLocateFields() {
  const value = (id) => document.getElementById(id).value.trim();
  return {
    address: value('geo-address'),
    lat: value('geo-lat'),
    lng: value('geo-lng'),
    ...Object.fromEntries(PLACE_LEVEL_KEYS.map((key) => [key, value(`geo-${key}`)])),
  };
}

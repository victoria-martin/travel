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
  ['lat', 'lng', 'city', 'county', 'region'].forEach((key) => {
    document.getElementById(`geo-${key}`).value = match[key] || '';
  });
  geocodeMatches = [];
  renderGeocodeMatches();
  setGeocodeStatus(
    `📍 ${[match.city, match.county, match.region].filter(Boolean).join(' · ') || match.label}`,
    false,
  );
}

function readLocateFields() {
  const value = (id) => document.getElementById(id).value.trim();
  return {
    geoAddress: value('geo-address'),
    lat: value('geo-lat'),
    lng: value('geo-lng'),
    city: value('geo-city'),
    county: value('geo-county'),
    region: value('geo-region'),
  };
}

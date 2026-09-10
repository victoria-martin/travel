/*
  Nominatim allows 1 request/second and no bulk geocoding, so an address is resolved only when
  the "Localiser" button is pressed, and the picked result is stored on the record.
  A failure here is never fatal: coordinates can also be typed by hand.
*/

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const GEOCODE_LIMIT = 5;

async function geocodeCandidates(address) {
  const query = (address || '').trim();
  if (!query) return [];
  const params = new URLSearchParams({
    format: 'json',
    limit: String(GEOCODE_LIMIT),
    addressdetails: '1',
    q: query,
  });
  try {
    const res = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Nominatim a répondu ${res.status}`);
    return (await res.json()).map(locationFromNominatim);
  } catch (e) {
    console.warn('Géocodage impossible', e);
    return [];
  }
}

function locationFromNominatim(result) {
  const parts = result.address || {};
  return {
    label: result.display_name || '',
    lat: result.lat,
    lng: result.lon,
    city: parts.city || parts.town || parts.village || parts.municipality || '',
    county: parts.county || '',
    region: parts.state || '',
  };
}

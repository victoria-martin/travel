/*
  Nominatim allows 1 request/second and no bulk geocoding, so an address is resolved once —
  on save — and the city, province, region and coordinates it returns are stored on the record.
*/

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

async function geocodeAddress(address) {
  const query = (address || '').trim();
  if (!query) return null;
  const params = new URLSearchParams({ format: 'json', limit: '1', addressdetails: '1', q: query });
  try {
    const res = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Nominatim a répondu ${res.status}`);
    const results = await res.json();
    return results.length ? locationFromNominatim(results[0]) : null;
  } catch (e) {
    console.warn('Géocodage impossible', e);
    return null;
  }
}

function locationFromNominatim(result) {
  const parts = result.address || {};
  return {
    lat: result.lat,
    lng: result.lon,
    city: parts.city || parts.town || parts.village || parts.municipality || '',
    county: parts.county || '',
    region: parts.state || '',
  };
}

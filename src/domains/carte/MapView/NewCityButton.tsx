import { ToolbarButton } from '@/shared/buttons/ToolbarButton';
import { ToolbarMenu } from '@/shared/menu/ToolbarMenu';
import { useState } from 'react';

const HELP = 'Tape une ville, puis localise-la.';

/*
  A city is created from the map, where the gap shows: type its name, pick the right geocoding
  result, the pin lands — the name kept is the result's, not the typed one (« sienne » → « Siena »).
*/
export function NewCityButton() {
  const [address, setAddress] = useState('');
  const [matches, setMatches] = useState<
    { label: string; lat: string; lng: string; city?: string }[]
  >([]);
  const [status, setStatus] = useState(HELP);

  const locate = async () => {
    const query = address.trim();
    setMatches([]);
    if (!query) return setStatus('Renseigne une ville à localiser.');
    setStatus('⏳ Localisation…');
    const found = await window.geocodeCandidates(query);
    setMatches(found);
    setStatus(
      found.length
        ? 'Choisis le bon résultat :'
        : '⚠️ Introuvable — ajoute-la depuis la page Lieux.',
    );
  };

  const create = (match: { lat: string; lng: string; city?: string }) => {
    const name = match.city || address.trim();
    const travelId = window.currentTravelId();
    if (!travelId) return;
    window.upsertVille({
      id: window.villeIdFromName(travelId, name),
      travelId,
      name,
      lat: match.lat,
      lng: match.lng,
    });
    setAddress('');
    setMatches([]);
    setStatus(`📍 ${name} ajoutée`);
    window.render();
  };

  return (
    <ToolbarMenu trigger={<ToolbarButton icon="plus" label="Ville" variant="primary" />}>
      <div className="new-city">
        <div className="locate-row">
          <input
            type="text"
            value={address}
            placeholder="Nom de la ville"
            onChange={(event) => setAddress(event.target.value)}
            onKeyDown={(event) => {
              event.stopPropagation();
              if (event.key !== 'Enter') return;
              event.preventDefault();
              locate();
            }}
          />
          <button type="button" className="btn btn-secondary btn-small" onClick={locate}>
            Localiser
          </button>
        </div>
        <div className="geocode-status">{status}</div>
        <div className="geocode-matches">
          {matches.map((match) => (
            <button
              type="button"
              key={`${match.lat},${match.lng},${match.label}`}
              className="geocode-match"
              onClick={() => create(match)}
            >
              {match.label}
            </button>
          ))}
        </div>
      </div>
    </ToolbarMenu>
  );
}

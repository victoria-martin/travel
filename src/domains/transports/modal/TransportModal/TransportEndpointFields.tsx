import { FieldRow } from '@/shared/layout/FieldRow';
import type { Attraction } from '@/store/types';
import { useTravelStore } from '@/store/useTravelStore';
import { useShallow } from 'zustand/react/shallow';

// Towns and villages open the list: that is where one leaves from; a beach or a site can still be the target.
const ENDPOINT_TYPES = ['city', 'village'];

export function TransportEndpointFields({
  side,
  label,
  placeId,
  precision,
}: {
  side: 'from' | 'to';
  label: string;
  placeId: string;
  precision: string;
}) {
  const places = useTravelStore(
    useShallow((store) => window.ofCurrentTravel(store.data.attractions)),
  ).sort((placeA, placeB) => placeA.name.localeCompare(placeB.name));
  const group = (groupLabel: string, items: Attraction[]) =>
    items.length ? (
      <optgroup label={groupLabel}>
        {items.map((place) => (
          <option key={place.id} value={place.id}>
            {place.name}
          </option>
        ))}
      </optgroup>
    ) : null;
  return (
    <FieldRow>
      <div className="field">
        <label htmlFor={`t-${side}-city`}>{label}</label>
        <select id={`t-${side}-city`} defaultValue={placeId}>
          <option value="">Aucun lieu</option>
          {group(
            'Villes et villages',
            places.filter((place) => ENDPOINT_TYPES.includes(place.type)),
          )}
          {group(
            'Autres lieux',
            places.filter((place) => !ENDPOINT_TYPES.includes(place.type)),
          )}
        </select>
      </div>
      <div className="field">
        <label htmlFor={`t-${side}-precision`}>Précision</label>
        <input id={`t-${side}-precision`} type="text" defaultValue={precision} />
      </div>
    </FieldRow>
  );
}

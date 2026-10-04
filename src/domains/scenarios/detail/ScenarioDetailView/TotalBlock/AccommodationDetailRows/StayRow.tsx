import type { RecapStop } from './recapStops';
import { RecapIconLabel } from './RecapIconLabel';

type Place = Extract<RecapStop, { kind: 'stay' }>['place'];

function PlaceLabel({ place }: { place: Place }) {
  if (place.place)
    return (
      <RecapIconLabel icon={window.attractionType(place.place.type).emoji}>
        {place.place.name}
      </RecapIconLabel>
    );
  if (place.acc)
    return (
      <RecapIconLabel icon={window.accType(place.acc.type).emoji}>
        {place.acc.name} <span className="acc-recap-city">· {place.acc.city}</span>
      </RecapIconLabel>
    );
  return (
    <RecapIconLabel icon="">
      <span className="acc-recap-city">Sans lieu</span>
    </RecapIconLabel>
  );
}

export function StayRow({ place }: { place: Place }) {
  return (
    <div className="acc-recap-row acc-recap-sub">
      <span>
        <PlaceLabel place={place} />
      </span>
      <span className="acc-recap-nights">
        {place.dates.length ? `${place.dates.join(', ')} · ` : ''}
        {window.nightsLabel(place.nights)}
      </span>
      <strong>{window.formatCosts(window.placeCost(place))}</strong>
    </div>
  );
}

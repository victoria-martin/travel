import type { Scenario } from '@/store/types';

type Place = ReturnType<Window['nightsByPlace']>[number];

// A segment too narrow does not carry its name: labels would overlap from a single night.
const MIN_LABELLED_SHARE = 0.08;

function placeName(place: Place): string {
  if (place.place) return place.place.name;
  return place.acc ? place.acc.city || place.acc.name : 'Sans lieu';
}

// One segment per place, as wide as its nights, on the scale of the longest scenario of the list.
export function ScenarioRouteBar({
  scenario,
  maxNights,
}: {
  scenario: Scenario;
  maxNights: number;
}) {
  const places = window.nightsByPlace(scenario);
  if (places.length === 0) return <div className="scenario-route-empty">Aucune étape</div>;
  const nights = window.totalNights(scenario);
  const start = window.stepArrival(scenario, 0);
  const end = start ? window.dateAfter(start, nights) : null;
  return (
    <div className="scenario-route" style={{ width: `${(nights / maxNights) * 100}%` }}>
      {start && (
        <div className="scenario-route-dates">
          <span>{window.formatStepDay(start)}</span>
          {nights > 0 && end ? <span>{window.formatStepDay(end)}</span> : null}
        </div>
      )}
      <div className="scenario-route-bar">
        {places.map((place) => {
          const statusKey = window.placeStatus(scenario, place);
          const status = window.stepStatusInfo(statusKey);
          return (
            <span
              key={place.firstStay}
              className="scenario-route-seg"
              style={{ flex: place.nights, background: window.stepStatusBackground(statusKey) }}
              title={`${placeName(place)} · ${window.nightsLabel(place.nights)} · ${status.emoji} ${status.label}`}
            />
          );
        })}
      </div>
      <div className="scenario-route-legend">
        {places.map((place) => (
          <span
            key={place.firstStay}
            className="scenario-route-name"
            style={{ flex: place.nights }}
          >
            {place.nights / nights >= MIN_LABELLED_SHARE ? placeName(place) : ''}
          </span>
        ))}
      </div>
    </div>
  );
}

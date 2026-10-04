import type { Scenario } from '@/store/types';
import { Fragment } from 'react';
import type { ScenarioRoute } from '../../hooks/useScenarioRoute';
import { LegRow } from './AccommodationDetailRows/LegRow';
import { PassageRow } from './AccommodationDetailRows/PassageRow';
import { recapStops } from './AccommodationDetailRows/recapStops';
import { StayRow } from './AccommodationDetailRows/StayRow';

// One row per stop along the trip, each preceded by the road that leads to it.
export function AccommodationDetailRows({
  scenario,
  route,
}: {
  scenario: Scenario;
  route: ScenarioRoute;
}) {
  return (
    <>
      {recapStops(scenario).map((stop) => (
        <Fragment key={`${stop.kind}-${stop.at}`}>
          <LegRow scenario={scenario} step={stop.step} route={route} />
          {stop.kind === 'stay' ? (
            <StayRow place={stop.place} />
          ) : (
            <PassageRow scenario={scenario} step={stop.step} at={stop.at} />
          )}
        </Fragment>
      ))}
    </>
  );
}

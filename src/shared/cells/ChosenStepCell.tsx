// Port de chosenStepCell (js/views/scenarios/chosen-step-for-place.js): the chosen scenario's step where the place lives.
export function ChosenStepCell({
  place,
}: {
  place: { accommodationId: string } | { attractionId: string };
}) {
  const found = window.chosenStepForPlace(place);
  if (!found) return <>—</>;
  const stepPlace = window.stepPlace(found.step);
  const location = stepPlace ? window.placeLevelsLabel(stepPlace) : '';
  const name = found.step.name || stepPlace?.name || 'Sans nom';
  return (
    <>
      {found.scenario.name} — {found.index + 1}. {name}
      {location ? ` — ${location}` : ''}
    </>
  );
}

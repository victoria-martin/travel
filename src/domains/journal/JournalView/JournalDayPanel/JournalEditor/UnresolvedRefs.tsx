import type { Scenario } from '@/store/types';

// A place typed in {} but not planned that day is flagged, never attached on its own: a typo must write nothing.
export function UnresolvedRefs({
  scenario,
  date,
  text,
}: {
  scenario: Scenario;
  date: string;
  text: string;
}) {
  const stepId = window.stepForJournalDay(scenario, date)?.id;
  if (!stepId) return null;
  const planned = new Set(window.journalPlannedItemsForDay(scenario, date).map((item) => item.id));
  const missing = new Map(
    window
      .journalTextRefs(text)
      .flatMap((ref) => (ref.entity ? [ref.entity] : []))
      .filter((entity) => entity.kind === 'attraction' && !planned.has(entity.id))
      .map((entity) => [entity.id, entity]),
  );
  if (!missing.size) return null;
  return (
    <div className="journal-missing-refs">
      {[...missing.values()].map((entity) => (
        <span key={entity.id} className="journal-missing-ref">
          {entity.name} n’est pas encore dans ce scénario ce jour-là
          <button
            type="button"
            className="link-btn"
            onClick={() => window.attachExtraAttraction(scenario.id, stepId, entity.id)}
          >
            Ajouter au scénario
          </button>
        </span>
      ))}
    </div>
  );
}

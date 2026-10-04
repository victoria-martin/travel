import type { Scenario } from '@/store/types';
import { CompareCard } from './CompareSection/CompareCard';

export function CompareSection({ scenarios }: { scenarios: Scenario[] }) {
  const chosen = window.comparedScenarios(scenarios);

  if (chosen.length === 0) {
    return <p className="filter-hint">Coche des scénarios pour les comparer.</p>;
  }

  return (
    <div className="scenario-compare">
      {chosen.map((scenario) => (
        <CompareCard key={scenario.id} scenario={scenario} />
      ))}
    </div>
  );
}

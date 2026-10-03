import { LegacyMarkup } from '@/shared/LegacyMarkup';
import type { Scenario } from '@/store/types';

// Port de scenarioCompare/scenarioCompareCard (js/views/scenarios/compare/{cards,card}.js) —
// délégué : un récap financier dense, même famille que les lignes de récap du détail d'un
// scénario (ScenarioLegacyMarkup), pas une liste ordinaire à reconstruire.
export function CompareSection({ scenarios }: { scenarios: Scenario[] }) {
  const chosen = window.comparedScenarios(scenarios);

  if (chosen.length === 0) {
    return <p className="filter-hint">Coche des scénarios pour les comparer.</p>;
  }

  return (
    <div className="scenario-compare">
      {chosen.map((scenario) => (
        <LegacyMarkup key={scenario.id} html={window.scenarioCompareCard(scenario)} />
      ))}
    </div>
  );
}

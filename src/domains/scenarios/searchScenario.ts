import { normalizeSearch } from '../../shared/normalizeSearch';
import type { Scenario } from '../../store/types';

// Port de scenarioMatchesSearch (js/views/scenarios/scenarios.js).
export function searchScenario(scenario: Scenario): string {
  const values: (string | undefined)[] = [scenario.name];
  scenario.steps.forEach((step) => {
    const place = window.stepPlace(step);
    values.push(step.name, place?.city, place?.name);
  });
  return values.filter(Boolean).join(' ');
}

export function matchesScenarioSearch(scenario: Scenario, query: string): boolean {
  const wanted = normalizeSearch(query);
  if (!wanted) return true;
  return normalizeSearch(searchScenario(scenario)).includes(wanted);
}

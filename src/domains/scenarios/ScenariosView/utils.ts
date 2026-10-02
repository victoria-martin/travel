// Port de scenarioRank (js/views/scenarios/scenarios.js) : le scénario retenu ouvre la liste, les
// favoris le suivent.
export function scenarioRank(scenario: { isChosen?: boolean; favorite: boolean }): number {
  return scenario.isChosen ? 0 : scenario.favorite ? 1 : 2;
}

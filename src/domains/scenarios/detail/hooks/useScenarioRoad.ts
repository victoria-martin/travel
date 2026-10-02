import type { Scenario } from '../../../../store/types';

export interface ScenarioRoad {
  points: [number, number][];
  kilometers: number | null;
  fuelCost: number;
  tollCost: number;
  total: number;
}

export function useScenarioRoad(scenario: Scenario | null): ScenarioRoad {
  if (!scenario) return { points: [], kilometers: 0, fuelCost: 0, tollCost: 0, total: 0 };

  return {
    points: window.scenarioRoadPoints(scenario),
    kilometers: window.scenarioRoadKm(scenario),
    fuelCost: window.scenarioFuelCost(scenario),
    tollCost: window.scenarioTollCost(scenario),
    total: window.scenarioRoadTotal(scenario),
  };
}

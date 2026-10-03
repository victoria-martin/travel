import type { Scenario } from '@/store/types';

export interface ScenarioMoney {
  accommodations: {
    euros: { amount: number; nights: number };
    guestPoints: { amount: number; nights: number };
  };
  charges: number;
  transport: number;
  attractions: number;
  total: { euros: number; guestPoints: number };
  perTraveler: number;
  nights: number;
}

export function useScenarioMoney(scenario: Scenario | null): ScenarioMoney {
  if (!scenario) {
    return {
      accommodations: {
        euros: { amount: 0, nights: 0 },
        guestPoints: { amount: 0, nights: 0 },
      },
      charges: 0,
      transport: 0,
      attractions: 0,
      total: { euros: 0, guestPoints: 0 },
      perTraveler: 0,
      nights: 0,
    };
  }

  const accommodations = window.accommodationTotals(scenario);
  const charges = window.scenarioChargesTotal(scenario);
  const transport = window.scenarioTransportTotal(scenario);
  const attractions = window.scenarioAttractionsTotal(scenario);
  const total = window.scenarioTotal(scenario);

  return {
    accommodations,
    charges,
    transport,
    attractions,
    total,
    perTraveler: window.scenarioTotalPerTraveler(scenario),
    nights: window.totalNights(scenario),
  };
}

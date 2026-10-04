import type { Scenario } from '@/store/types';
import { RoadCostRow } from './RoadCostRow';

export function RoadFuelCostRow({ scenario }: { scenario: Scenario }) {
  const consumption = window.scenarioFuelConsumption(scenario);
  const note = consumption
    ? `${window.formatRate(consumption)} L/100 · ${window.formatRate(window.travelFuelPrice())} €/L`
    : 'consommation du modèle non renseignée';
  return (
    <RoadCostRow
      scenario={scenario}
      field="fuelBudget"
      label="Essence"
      note={note}
      calculated={window.scenarioFuelCalc(scenario)}
    />
  );
}

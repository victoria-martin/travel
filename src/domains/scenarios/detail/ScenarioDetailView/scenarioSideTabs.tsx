import type { Scenario } from '@/store/types';
import { MapTab } from './ScenarioSidePanel/MapTab';
import { MoneyTab } from './ScenarioSidePanel/MoneyTab';
import { PackingTab } from './ScenarioSidePanel/PackingTab';
import { TransportsTab } from './ScenarioSidePanel/TransportsTab';

export const SCENARIO_SIDE_TABS: {
  key: string;
  icon: string;
  label: string;
  Body: (props: { scenario: Scenario }) => React.ReactNode;
}[] = [
  { key: 'map', icon: 'map', label: 'Carte', Body: MapTab },
  { key: 'transports', icon: 'plane', label: 'Transports', Body: TransportsTab },
  { key: 'money', icon: 'euro', label: 'Argent', Body: MoneyTab },
  { key: 'valise', icon: 'luggage', label: 'Valise', Body: PackingTab },
];

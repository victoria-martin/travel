import { ScenarioDetailSettings } from '@/domains/scenarios/detail/ScenarioDetailView/ScenarioDetailHeader/ScenarioDetailSettings';

// Port de PAGE_SETTINGS/pageSettingsBlock (js/views/settings/page-settings.js).
const PAGE_SETTINGS = [{ view: 'scenario-detail', Settings: ScenarioDetailSettings }];

export function PageSettings() {
  const entry = PAGE_SETTINGS.find((page) => page.view === window.getCurrentView());
  return entry ? <entry.Settings /> : null;
}

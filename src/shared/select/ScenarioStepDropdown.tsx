import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MenuPortal } from '@/shared/select/MenuPortal';
import { useTravelStore } from '@/store/useTravelStore';
import { useShallow } from 'zustand/react/shallow';

// Every step of the trip's active scenarios, grouped by scenario: the step's name first, its place's levels next to it.
export function ScenarioStepDropdown({
  className,
  label,
  onPick,
}: {
  className: string;
  label: string;
  onPick: (scenarioId: string, stepId: string) => void;
}) {
  const scenarios = useTravelStore(
    useShallow((store) => window.activeScenarios(window.ofCurrentTravel(store.data.scenarios))),
  );
  const groups = scenarios
    .map((scenario) => ({ scenario, steps: window.visibleSteps(scenario) }))
    .filter((group) => group.steps.length > 0);
  return (
    <div className={`inline-dropdown ${className}`}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button type="button" className="btn btn-outline">
            {label}
          </button>
        </DropdownMenu.Trigger>
        <MenuPortal>
          <DropdownMenu.Content
            className="inline-menu"
            align="start"
            sideOffset={4}
            collisionPadding={8}
          >
            {groups.length === 0 && <div className="inline-menu-group">Aucun scénario</div>}
            {groups.map(({ scenario, steps }) => (
              <div key={scenario.id}>
                <div className="inline-menu-group">{scenario.name}</div>
                {steps.map((step) => {
                  const stepId = step.id;
                  if (!stepId) return null;
                  const place = window.stepPlace(step);
                  const location = place ? window.placeLevelsLabel(place) : '';
                  return (
                    <DropdownMenu.Item
                      key={stepId}
                      asChild
                      onSelect={() => onPick(scenario.id, stepId)}
                    >
                      <button type="button" className="inline-menu-item">
                        {step.name || place?.name || 'Sans nom'}
                        {location ? ` — ${location}` : ''}
                      </button>
                    </DropdownMenu.Item>
                  );
                })}
              </div>
            ))}
          </DropdownMenu.Content>
        </MenuPortal>
      </DropdownMenu.Root>
    </div>
  );
}

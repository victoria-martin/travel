import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { TagLabel } from '@/shared/TagLabel';
import { OpenResourceMenuItem } from '@/shared/select/OpenResourceMenuItem';
import type { Scenario, Step } from '@/store/types';

export function StepNightsDropdown({ scenario, step }: { scenario: Scenario; step: Step }) {
  const stepId = step.id;
  if (!stepId) return null;
  const current = window.stepNights(step);
  return (
    <div className="inline-dropdown nights-dropdown">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button type="button" className="inline-tag">
            <TagLabel label={window.nightsLabel(current)} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="inline-menu"
            align="start"
            sideOffset={4}
            collisionPadding={8}
          >
            <OpenResourceMenuItem onSelect={() => window.openModal('step', scenario.id, stepId)} />
            {window.NIGHTS_OPTIONS.map((n) => (
              <DropdownMenu.Item
                key={n}
                asChild
                onSelect={() => window.setStepNights(scenario.id, stepId, String(n))}
              >
                <button
                  type="button"
                  className={`inline-menu-item ${n === current ? 'selected' : ''}`}
                >
                  {window.nightsLabel(n)}
                </button>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}

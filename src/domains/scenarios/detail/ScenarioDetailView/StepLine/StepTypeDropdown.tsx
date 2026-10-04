import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Icon } from '@/shared/Icon';
import { OpenResourceMenuItem } from '@/shared/select/OpenResourceMenuItem';
import { TagDropdown } from '@/shared/select/TagDropdown';
import type { Scenario, Step } from '@/store/types';

// Le type ne restreint que les hébergements proposés par StepPlaceDropdown ; un lieu reste
// proposé quel que soit le type retenu.
export function StepTypeDropdown({ scenario, step }: { scenario: Scenario; step: Step }) {
  const stepId = step.id;
  if (!stepId) return null;
  const key = window.accTypeKey(step.accommodationType);
  const current = key ? window.accType(key) : null;
  return (
    <TagDropdown
      className="type-dropdown"
      dict={window.ACCOMMODATION_TYPES}
      current={current}
      placeholder={
        <>
          <Icon name="plus" /> type
        </>
      }
      beforeItems={
        <>
          <OpenResourceMenuItem
            onSelect={() => window.openModal('step', scenario.id, stepId)}
          />
          <DropdownMenu.Item
            asChild
            onSelect={() => window.setStepAccommodationType(scenario.id, stepId, '')}
          >
            <button type="button" className={`inline-menu-item${current ? '' : ' selected'}`}>
              Tous les lieux
            </button>
          </DropdownMenu.Item>
        </>
      }
      onPick={(type) => window.setStepAccommodationType(scenario.id, stepId, type)}
    />
  );
}

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MenuPortal } from '@/shared/select/MenuPortal';
import { Icon } from '@/shared/Icon';
import type { Scenario } from '@/store/types';

export function ScenarioExpenseDropdown({ scenario }: { scenario: Scenario }) {
  const attachable = window.costMatches('', scenario.costIds);
  return (
    <div className="inline-dropdown expense-dropdown">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button type="button" className="inline-tag">
            <span className="inline-emoji">
              <Icon name="wallet" />
            </span>
            <span className="inline-label">Rattacher une dépense</span>
          </button>
        </DropdownMenu.Trigger>
        <MenuPortal>
          <DropdownMenu.Content
            className="inline-menu"
            align="start"
            sideOffset={4}
            collisionPadding={8}
          >
            {attachable.length === 0 ? (
              <div className="inline-menu-group">Aucune dépense à rattacher</div>
            ) : (
              attachable.map((cost) => (
                <DropdownMenu.Item
                  key={cost.id}
                  asChild
                  onSelect={() => window.attachScenarioExpense(scenario.id, cost.id)}
                >
                  <button type="button" className="inline-menu-item">
                    <span className="inline-label">{window.costLabel(cost)}</span>
                    {cost.amount && (
                      <span className="inline-menu-aside">{window.expenseAmountLabel(cost)}</span>
                    )}
                  </button>
                </DropdownMenu.Item>
              ))
            )}
          </DropdownMenu.Content>
        </MenuPortal>
      </DropdownMenu.Root>
    </div>
  );
}

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { Extra, Scenario, Step, StepGroup } from '@/store/types';

// Une seule fois ne se dit pas : la pastille ne s'affiche qu'au survol tant que le nombre vaut 1
// (cf. .extra-count-once en CSS).
export function ExtraCountDropdown({
  scenario,
  holder,
  line,
}: {
  scenario: Scenario;
  holder: Step | StepGroup;
  line: Extra;
}) {
  const holderId = holder.id;
  if (!holderId) return null;
  const current = window.extraCount(line);
  return (
    <div
      className={`inline-dropdown extra-count-dropdown${current === 1 ? ' extra-count-once' : ''}`}
    >
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button type="button" className="inline-tag">
            {window.extraCountLabel(current)}
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="inline-menu"
            align="start"
            sideOffset={4}
            collisionPadding={8}
          >
            {window.EXTRA_COUNTS.map((n) => (
              <DropdownMenu.Item
                key={n}
                asChild
                onSelect={() => window.setExtraCount(scenario.id, holderId, line.id, n)}
              >
                <button
                  type="button"
                  className={`inline-menu-item ${n === current ? 'selected' : ''}`}
                >
                  {window.extraCountLabel(n)}
                </button>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}

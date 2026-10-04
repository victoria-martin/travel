import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Icon } from '@/shared/Icon';
import { TagLabel } from '@/shared/TagLabel';
import { OpenResourceMenuItem } from '@/shared/select/OpenResourceMenuItem';
import type { Extra, Scenario, Step, StepGroup } from '@/store/types';
import { ExtraLabel } from '../ExtraLabel';

// La pastille d'une ligne ouvre ses alternatives du même genre : une activité se remplace par une
// activité, une dépense par une dépense.
export function ExtraMenu({
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
  const attraction = line.attractionId ? window.getAttraction(line.attractionId) : undefined;
  const cost = line.costId ? window.getFixedCost(line.costId) : undefined;
  const costAlternatives = line.costId
    ? window.costMatches('', window.extraSiblingIds(holder, line, 'costId'))
    : [];
  const attractionAlternatives = line.costId
    ? []
    : window.attractionMatches('', window.extraSiblingIds(holder, line, 'attractionId'));

  return (
    <div className="inline-dropdown extra-dropdown">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button type="button" className="inline-tag" style={{ font: 'inherit' }}>
            <ExtraLabel line={line} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="inline-menu"
            align="start"
            sideOffset={4}
            collisionPadding={8}
          >
            {(attraction || cost) && (
              <OpenResourceMenuItem
                onSelect={() =>
                  cost
                    ? window.openModal('charge', cost.id)
                    : window.openAttractionSheet(attraction!.id)
                }
              />
            )}
            {(attraction || cost) && (
              <div className="inline-menu-row inline-menu-row-selected">
                <button type="button" className="inline-menu-item selected">
                  <ExtraLabel line={line} />
                </button>
                <button
                  type="button"
                  className="inline-menu-item-remove"
                  title="Désélectionner"
                  aria-label="Désélectionner"
                  onClick={() => window.detachExtra(scenario.id, holderId, line.id)}
                >
                  <Icon name="x" />
                </button>
              </div>
            )}
            {costAlternatives.map((item) => (
              <DropdownMenu.Item
                key={item.id}
                asChild
                onSelect={() => window.setExtraCost(scenario.id, holderId, line.id, item.id)}
              >
                <button
                  type="button"
                  className={`inline-menu-item ${item.id === line.costId ? 'selected' : ''}`}
                >
                  <Icon name="wallet" />{' '}
                  <span className="inline-label">{window.costLabel(item)}</span>
                </button>
              </DropdownMenu.Item>
            ))}
            {attractionAlternatives.map((item) => (
              <DropdownMenu.Item
                key={item.id}
                asChild
                onSelect={() => window.setExtraAttraction(scenario.id, holderId, line.id, item.id)}
              >
                <button
                  type="button"
                  className={`inline-menu-item ${item.id === line.attractionId ? 'selected' : ''}`}
                >
                  <TagLabel emoji={window.attractionType(item.type).emoji} label={item.name} />
                </button>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}

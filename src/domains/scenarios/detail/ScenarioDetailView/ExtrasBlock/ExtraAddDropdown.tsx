import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useRef, useState } from 'react';
import { Icon } from '@/shared/Icon';
import { TagLabel } from '@/shared/TagLabel';
import type { Scenario, Step, StepGroup } from '@/store/types';

/*
  La recherche interroge d'un coup les deux vocabulaires — activités et dépenses — parce qu'on
  cherche un nom sans se demander de quelle table il vient. Le menu reste ouvert après un
  rattachement (preventDefault sur onSelect) : on en attache souvent plusieurs d'affilée.
*/
export function ExtraAddDropdown({
  scenario,
  holder,
}: {
  scenario: Scenario;
  holder: Step | StepGroup;
}) {
  const holderId = holder.id;
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const focusSearch = () => requestAnimationFrame(() => inputRef.current?.focus());
  if (!holderId) return null;

  const lines = window.holderExtras(holder);
  const attractions = window.attractionMatches(
    search,
    lines.map((line) => line.attractionId).filter(Boolean),
  );
  const costs = window.costMatches(
    search,
    lines.map((line) => line.costId).filter(Boolean),
  );

  const attachAttraction = (attractionId: string) => {
    window.attachExtraAttraction(scenario.id, holderId, attractionId);
    setSearch('');
    focusSearch();
  };
  const attachCost = (costId: string) => {
    window.attachExtraCost(scenario.id, holderId, costId);
    setSearch('');
    focusSearch();
  };
  const createAttraction = () => {
    if (!search) return;
    attachAttraction(window.createAttractionNamed(search).id);
  };
  const createCost = () => {
    if (!search) return;
    attachCost(window.createFixedCostNamed(search).id);
  };

  return (
    <div className="inline-dropdown extra-add-dropdown">
      <DropdownMenu.Root onOpenChange={(open) => open && focusSearch()}>
        <DropdownMenu.Trigger asChild>
          <button type="button" className="step-extra-add" title="Rattacher une activité ou une dépense">
            <Icon name="plus" /> ajouter
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="inline-menu"
            align="start"
            sideOffset={4}
            collisionPadding={8}
          >
            <input
              ref={inputRef}
              className="inline-menu-search"
              type="text"
              placeholder="Activité ou dépense…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter') return;
                event.preventDefault();
                if (!search) return;
                if (attractions[0]) return attachAttraction(attractions[0].id);
                if (costs[0]) return attachCost(costs[0].id);
                createAttraction();
              }}
            />
            {attractions.length > 0 && (
              <>
                <div className="inline-menu-group">Activités</div>
                {attractions.map((attraction) => (
                  <DropdownMenu.Item
                    key={attraction.id}
                    asChild
                    onSelect={(event) => {
                      event.preventDefault();
                      attachAttraction(attraction.id);
                    }}
                  >
                    <button type="button" className="inline-menu-item">
                      <TagLabel emoji={window.attractionType(attraction.type).emoji} label={attraction.name} />
                    </button>
                  </DropdownMenu.Item>
                ))}
              </>
            )}
            {costs.length > 0 && (
              <>
                <div className="inline-menu-group">Dépenses</div>
                {costs.map((cost) => (
                  <DropdownMenu.Item
                    key={cost.id}
                    asChild
                    onSelect={(event) => {
                      event.preventDefault();
                      attachCost(cost.id);
                    }}
                  >
                    <button type="button" className="inline-menu-item">
                      <Icon name="wallet" /> <span className="inline-label">{window.costLabel(cost)}</span>
                    </button>
                  </DropdownMenu.Item>
                ))}
              </>
            )}
            {search && (
              <>
                <DropdownMenu.Item
                  asChild
                  onSelect={(event) => {
                    event.preventDefault();
                    createAttraction();
                  }}
                >
                  <button type="button" className="inline-menu-item inline-menu-item-create">
                    <Icon name="plus" /> Créer l'activité « {search} »
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  asChild
                  onSelect={(event) => {
                    event.preventDefault();
                    createCost();
                  }}
                >
                  <button type="button" className="inline-menu-item inline-menu-item-create">
                    <Icon name="plus" /> Créer la dépense « {search} »
                  </button>
                </DropdownMenu.Item>
              </>
            )}
            {attractions.length === 0 && costs.length === 0 && !search && (
              <div className="inline-menu-group">Rien à rattacher</div>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useState } from 'react';
import { Icon } from '@/shared/Icon';
import type { Accommodation, Attraction, Scenario, Step } from '@/store/types';

function placeOptionLabel(place: Accommodation | Attraction) {
  const location = window.placeLevelsLabel(place);
  return location ? `${place.name} — ${location}` : place.name;
}

// On cherche un lieu par son nom comme par sa province.
function placeMatches(place: Accommodation | Attraction, needle: string) {
  return `${place.name} ${window.placeLevelsLabel(place)}`.toLowerCase().includes(needle.toLowerCase());
}

function favoriteFirst(itemA: { favorite: boolean; name: string }, itemB: { favorite: boolean; name: string }) {
  return (itemB.favorite ? 1 : 0) - (itemA.favorite ? 1 : 0) || itemA.name.localeCompare(itemB.name);
}

/*
  Les hébergements viennent en premier, un groupe par type et les favoris en tête de chacun ; les
  lieux ferment la liste, groupés par type eux aussi, et y sont quel que soit le type retenu — il
  ne restreint que les hébergements. Un groupe se replie ; une recherche en cours les déplie tous,
  sinon ce qu'on vient de taper resterait caché. Une ville qui manque se crée sous le nom tapé.
*/
export function StepPlaceDropdown({ scenario, step }: { scenario: Scenario; step: Step }) {
  const stepId = step.id;
  const [search, setSearch] = useState('');
  const [folded, setFolded] = useState<Set<string>>(new Set());
  if (!stepId) return null;

  const toggleFold = (key: string) =>
    setFolded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  const isFolded = (key: string) => !search && folded.has(key);

  const type = window.accTypeKey(step.accommodationType);
  const accommodations = window
    .ofCurrentTravel(window.state.accommodations as Accommodation[])
    .filter((item) => (!type || window.accTypeKey(item.type) === type) && placeMatches(item, search))
    .sort(favoriteFirst);
  const attractions = window
    .ofCurrentTravel(window.state.attractions as Attraction[])
    .filter((item) => placeMatches(item, search))
    .sort(favoriteFirst);

  const current = step.attractionId
    ? window.getAttraction(step.attractionId)
    : step.accommodationId
      ? window.getAccommodation(step.accommodationId)
      : undefined;
  const currentEmoji = step.attractionId
    ? current && window.attractionType((current as Attraction).type).emoji
    : '';

  const createCity = () => {
    if (!search) return;
    const place = {
      ...window.emptyAttraction(),
      id: window.uid(),
      travelId: window.currentTravelId() ?? scenario.travelId,
      name: search,
      type: 'city',
      city: search,
    };
    window.upsertAttraction(place);
    window.setStepPlace(scenario.id, stepId, `lieu:${place.id}`);
    setSearch('');
  };

  const noMatches = accommodations.length === 0 && attractions.length === 0 && !search;

  return (
    <div className="inline-dropdown place-dropdown">
      <DropdownMenu.Root onOpenChange={(open) => !open && setSearch('')}>
        <DropdownMenu.Trigger asChild>
          <button type="button" className={`inline-tag step-place-tag${current ? '' : ' inline-tag-empty'}`}>
            {current ? (
              <>
                {currentEmoji && <span className="inline-emoji">{currentEmoji}</span>}
                <span className="inline-label">{current.name}</span>
              </>
            ) : (
              <>
                <Icon name="plus" /> lieu
              </>
            )}
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="inline-menu" align="start" sideOffset={4} collisionPadding={8}>
            <input
              className="inline-menu-search"
              type="text"
              placeholder="Chercher un lieu…"
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {(step.accommodationId || step.attractionId) && (
              <DropdownMenu.Item
                asChild
                onSelect={() => {
                  if (step.accommodationId) window.openAccommodationSheet(step.accommodationId);
                  else if (step.attractionId) window.openAttractionSheet(step.attractionId);
                }}
              >
                <button type="button" className="inline-menu-item inline-menu-item-resource">
                  <Icon name="arrow-up-right" /> Ouvrir la ressource
                </button>
              </DropdownMenu.Item>
            )}
            <DropdownMenu.Item asChild onSelect={() => window.setStepPlace(scenario.id, stepId, '')}>
              <button
                type="button"
                className={`inline-menu-item ${!step.attractionId && !step.accommodationId ? 'selected' : ''}`}
              >
                Aucun lieu choisi
              </button>
            </DropdownMenu.Item>
            {[...Object.keys(window.ACCOMMODATION_TYPES), ''].map((key) => {
              const label = key ? window.ACCOMMODATION_TYPES[key].label : window.UNSET_ACCOMMODATION_TYPE.label;
              const items = accommodations.filter((item) => window.accTypeKey(item.type) === key);
              if (!items.length) return null;
              const groupKey = `heb-${key || 'autre'}`;
              const folded = isFolded(groupKey);
              return (
                <div key={groupKey}>
                  <button
                    type="button"
                    className="inline-menu-group inline-menu-fold"
                    onClick={() => toggleFold(groupKey)}
                  >
                    <span className={`inline-menu-caret${folded ? ' folded' : ''}`}>⌄</span>
                    {label} {folded && <span className="inline-menu-aside">{items.length}</span>}
                  </button>
                  {!folded &&
                    items.map((accommodation) => {
                      const selected = step.accommodationId === accommodation.id;
                      return (
                        <div
                          key={accommodation.id}
                          className={`inline-menu-row${selected ? ' inline-menu-row-selected' : ''}`}
                        >
                          <DropdownMenu.Item
                            asChild
                            onSelect={() => window.setStepPlace(scenario.id, stepId, `heb:${accommodation.id}`)}
                          >
                            <button type="button" className={`inline-menu-item${selected ? ' selected' : ''}`}>
                              <span className="inline-emoji">{window.accType(accommodation.type).emoji}</span>
                              <span className="inline-label">
                                {accommodation.favorite && <Icon name="star" fill />} {placeOptionLabel(accommodation)}
                              </span>
                            </button>
                          </DropdownMenu.Item>
                          {selected && (
                            <button
                              type="button"
                              className="inline-menu-item-remove"
                              title="Désélectionner"
                              aria-label="Désélectionner"
                              onClick={() => window.setStepPlace(scenario.id, stepId, '')}
                            >
                              <Icon name="x" />
                            </button>
                          )}
                          <button
                            type="button"
                            className="sheet-btn"
                            title="Ouvrir la fiche"
                            onClick={() => window.openAccommodationSheet(accommodation.id)}
                          >
                            <Icon name="arrow-up-right" />
                          </button>
                        </div>
                      );
                    })}
                </div>
              );
            })}
            {[...Object.keys(window.ATTRACTION_TYPES), ''].map((key) => {
              const label = key ? window.ATTRACTION_TYPES[key].label : window.UNSET_ATTRACTION_TYPE.label;
              const items = attractions.filter((item) => window.attractionTypeKey(item.type) === key);
              if (!items.length) return null;
              const groupKey = `lieu-${key || 'autre'}`;
              const folded = isFolded(groupKey);
              return (
                <div key={groupKey}>
                  <button
                    type="button"
                    className="inline-menu-group inline-menu-fold"
                    onClick={() => toggleFold(groupKey)}
                  >
                    <span className={`inline-menu-caret${folded ? ' folded' : ''}`}>⌄</span>
                    {label} {folded && <span className="inline-menu-aside">{items.length}</span>}
                  </button>
                  {!folded &&
                    items.map((attraction) => {
                      const selected = step.attractionId === attraction.id;
                      return (
                        <div
                          key={attraction.id}
                          className={`inline-menu-row${selected ? ' inline-menu-row-selected' : ''}`}
                        >
                          <DropdownMenu.Item
                            asChild
                            onSelect={() => window.setStepPlace(scenario.id, stepId, `lieu:${attraction.id}`)}
                          >
                            <button type="button" className={`inline-menu-item${selected ? ' selected' : ''}`}>
                              <span className="inline-emoji">{window.attractionType(attraction.type).emoji}</span>
                              <span className="inline-label">
                                {attraction.favorite && <Icon name="star" fill />} {placeOptionLabel(attraction)}
                              </span>
                            </button>
                          </DropdownMenu.Item>
                          {selected && (
                            <button
                              type="button"
                              className="inline-menu-item-remove"
                              title="Désélectionner"
                              aria-label="Désélectionner"
                              onClick={() => window.setStepPlace(scenario.id, stepId, '')}
                            >
                              <Icon name="x" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
              );
            })}
            {search && (
              <DropdownMenu.Item
                asChild
                onSelect={(event) => {
                  event.preventDefault();
                  createCity();
                }}
              >
                <button type="button" className="inline-menu-item inline-menu-item-create">
                  <Icon name="plus" /> Créer la ville « {search} »
                </button>
              </DropdownMenu.Item>
            )}
            {noMatches && <div className="inline-menu-group">Aucun lieu trouvé</div>}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}

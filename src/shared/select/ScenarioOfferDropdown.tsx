import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MenuPortal } from '@/shared/menu/MenuPortal';
import { Icon } from '@/shared/Icon';
import { OpenResourceMenuItem } from '@/shared/select/OpenResourceMenuItem';
import { TagLabel } from '@/shared/TagLabel';
import type { Offer, Scenario } from '@/store/types';

// Offers are grouped by provider, as they were noted; each shows its cost over this scenario's days, options excluded.
export function ScenarioOfferDropdown({
  scenario,
  offers,
}: {
  scenario: Scenario;
  offers: Offer[];
}) {
  const current = window.getScenarioOffer(scenario);
  const days = window.totalDays(scenario);
  const providerGroups = window
    .providersOfMode('car')
    .map((provider) => ({
      provider,
      offers: offers.filter((offer) => offer.providerId === provider.id),
    }))
    .filter((group) => group.offers.length > 0);

  return (
    <div className="inline-dropdown car-dropdown">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button type="button" className="inline-tag">
            <TagLabel label={current ? window.offerLabel(current) : 'Aucune voiture'} />
          </button>
        </DropdownMenu.Trigger>
        <MenuPortal>
          <DropdownMenu.Content
            className="inline-menu"
            align="start"
            sideOffset={4}
            collisionPadding={8}
          >
            {current && <OpenResourceMenuItem onSelect={() => window.openOfferSheet(current.id)} />}
            <DropdownMenu.Item asChild onSelect={() => window.setScenarioOffer(scenario.id, '')}>
              <button
                type="button"
                className={`inline-menu-item ${scenario.offerId ? '' : 'selected'}`}
              >
                Aucune voiture
              </button>
            </DropdownMenu.Item>
            {providerGroups.map((group) => (
              <div key={group.provider.id}>
                <div className="inline-menu-group">{group.provider.name}</div>
                {group.offers.map((offer) => {
                  const cost = window.offerDayPrice(offer) * days;
                  const dates = window.offerDatesLabel(offer).join(' · ');
                  return (
                    <DropdownMenu.Item
                      key={offer.id}
                      asChild
                      onSelect={() => window.setScenarioOffer(scenario.id, offer.id)}
                    >
                      <button
                        type="button"
                        className={`inline-menu-item ${scenario.offerId === offer.id ? 'selected' : ''}`}
                      >
                        <span className="inline-label">
                          {window.offerModelName(offer) || 'Sans modèle'}
                          {dates ? ` — ${dates}` : ''}
                        </span>
                        {cost ? (
                          <span className="inline-menu-aside">{window.formatEuros(cost)}</span>
                        ) : null}
                      </button>
                    </DropdownMenu.Item>
                  );
                })}
              </div>
            ))}
            <DropdownMenu.Item
              asChild
              onSelect={() => window.openModal('voiture', '', scenario.id)}
            >
              <button type="button" className="inline-menu-item inline-menu-item-create">
                <Icon name="plus" /> Ajouter une voiture
              </button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </MenuPortal>
      </DropdownMenu.Root>
    </div>
  );
}

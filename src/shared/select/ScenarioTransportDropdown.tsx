import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MenuPortal } from '@/shared/select/MenuPortal';
import { Icon } from '@/shared/Icon';
import type { Scenario, Transport } from '@/store/types';

export function ScenarioTransportDropdown({
  scenario,
  transports,
}: {
  scenario: Scenario;
  transports: Transport[];
}) {
  const attachable = transports.filter(
    (transport) => !scenario.transportIds.includes(transport.id),
  );
  return (
    <div className="inline-dropdown transport-dropdown">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button type="button" className="inline-tag" style={{ font: 'inherit' }}>
            <span className="inline-emoji">
              <Icon name="plane" />
            </span>
            <span className="inline-label">Rattacher un trajet</span>
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
              <div className="inline-menu-group">Aucun trajet à rattacher</div>
            ) : (
              attachable.map((transport) => (
                <DropdownMenu.Item
                  key={transport.id}
                  asChild
                  onSelect={() => window.attachScenarioTransport(scenario.id, transport.id)}
                >
                  <button type="button" className="inline-menu-item">
                    <span className="inline-emoji">
                      {window.transportMode(transport.mode).emoji}
                    </span>
                    <span className="inline-label">{window.transportLegLabel(transport)}</span>
                    <span className="inline-menu-aside">{window.priceLabel(transport)}</span>
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

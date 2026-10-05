import { ToolbarButton } from '@/shared/buttons/ToolbarButton';
import { Icon } from '@/shared/Icon';
import { ToolbarMenu } from '@/shared/menu/ToolbarMenu';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

// The five ways in: four pasted links, each with its own form, and typing it by hand.
const DOORS = [
  { modal: 'accommodation-booking', icon: 'hotel', label: 'Depuis un lien Booking' },
  { modal: 'accommodation-home-exchange', icon: 'house', label: 'Depuis un lien HomeExchange' },
  { modal: 'accommodation-airbnb', icon: 'bed', label: 'Depuis un lien Airbnb' },
  { modal: 'accommodation-google-maps', icon: 'map-pin', label: 'Depuis un lien Google Maps' },
  { modal: 'accommodation', icon: 'pencil-line', label: 'À la main' },
];

export function AccommodationAddMenu() {
  return (
    <ToolbarMenu trigger={<ToolbarButton icon="plus" label="Ajouter" variant="primary" />}>
      <div className="filter-block">
        <p className="filter-title">Ajouter un hébergement</p>
        {DOORS.map((door) => (
          <DropdownMenu.Item key={door.modal} asChild onSelect={() => window.openModal(door.modal)}>
            <button type="button" className="panel-action">
              <Icon name={door.icon} /> {door.label}
            </button>
          </DropdownMenu.Item>
        ))}
      </div>
    </ToolbarMenu>
  );
}

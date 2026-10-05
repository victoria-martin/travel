import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MenuPortal } from '@/shared/menu/MenuPortal';
import type { PackingListItem } from '@/store/types';

const MAX_PACKING_QUANTITY = 20;

// A fixed number, or one per night of the chosen scenario.
export function PackingQuantityDropdown({ item }: { item: PackingListItem }) {
  const current = window.packingItemQuantity(item);
  return (
    <div className="inline-dropdown packing-quantity-dropdown">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button type="button" className="inline-tag">
            {window.packingQuantityLabel(item)}
          </button>
        </DropdownMenu.Trigger>
        <MenuPortal>
          <DropdownMenu.Content
            className="inline-menu"
            align="start"
            sideOffset={4}
            collisionPadding={8}
          >
            <DropdownMenu.Item asChild onSelect={() => window.setPackingPerNight(item.id)}>
              <button
                type="button"
                className={`inline-menu-item ${item.perNight ? 'selected' : ''}`}
              >
                1 par nuit
              </button>
            </DropdownMenu.Item>
            {Array.from({ length: MAX_PACKING_QUANTITY }, (_, index) => index + 1).map(
              (quantity) => (
                <DropdownMenu.Item
                  key={quantity}
                  asChild
                  onSelect={() => window.setPackingQuantity(item.id, quantity)}
                >
                  <button
                    type="button"
                    className={`inline-menu-item ${!item.perNight && quantity === current ? 'selected' : ''}`}
                  >
                    {quantity}
                  </button>
                </DropdownMenu.Item>
              ),
            )}
          </DropdownMenu.Content>
        </MenuPortal>
      </DropdownMenu.Root>
    </div>
  );
}

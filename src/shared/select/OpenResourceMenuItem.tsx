import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Icon } from '../Icon';

export function OpenResourceMenuItem({ onSelect }: { onSelect: () => void }) {
  return (
    <DropdownMenu.Item asChild onSelect={onSelect}>
      <button type="button" className="inline-menu-item inline-menu-item-resource">
        <Icon name="arrow-up-right" /> Ouvrir la ressource
      </button>
    </DropdownMenu.Item>
  );
}

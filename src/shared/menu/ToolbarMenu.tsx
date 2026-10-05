import { MenuPortal } from '@/shared/menu/MenuPortal';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { ReactNode } from 'react';

/*
  A header menu: the trigger and the content come from the caller. It stays open while its fields
  are used — no DropdownMenu.Item inside, so nothing closes it on a pick.
*/
export function ToolbarMenu({
  trigger,
  align = 'end',
  wide,
  children,
}: {
  trigger: ReactNode;
  align?: 'start' | 'end';
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <MenuPortal>
        <DropdownMenu.Content
          className={`toolbar-menu${wide ? ' toolbar-menu-wide' : ''}`}
          align={align}
          sideOffset={6}
          collisionPadding={8}
        >
          {children}
        </DropdownMenu.Content>
      </MenuPortal>
    </DropdownMenu.Root>
  );
}

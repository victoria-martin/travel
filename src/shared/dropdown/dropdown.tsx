import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import React from 'react';

export const DropdownContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <DropdownMenu.Content
      className="toolbar-menu toolbar-menu-wide"
      align="end"
      sideOffset={6}
      collisionPadding={8}
    >
      {children}
    </DropdownMenu.Content>
  );
};

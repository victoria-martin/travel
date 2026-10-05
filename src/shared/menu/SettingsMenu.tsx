import { SettingsButton } from '@/shared/buttons/SettingsButton';
import { SettingsMenuContent } from '@/shared/menu/SettingsMenu/SettingsMenuContent';
import { ToolbarMenu } from '@/shared/menu/ToolbarMenu';
import type { ReactNode } from 'react';

// Port de toolbarMenu/settingsBlocks (js/views/toolbar/menu.js, js/views/settings/blocks.js).
export function SettingsMenu({ children }: { children?: ReactNode }) {
  return (
    <ToolbarMenu trigger={<SettingsButton />} wide>
      <SettingsMenuContent>{children}</SettingsMenuContent>
    </ToolbarMenu>
  );
}

import { ToolbarButton } from '@/shared/buttons/ToolbarButton';
import { SettingsMenuContent } from '@/shared/menu/SettingsMenu/SettingsMenuContent';
import { ToolbarMenu } from '@/shared/menu/ToolbarMenu';
import type { ReactNode } from 'react';

// Port de toolbarMenu/settingsBlocks (js/views/toolbar/menu.js, js/views/settings/blocks.js).
export function SettingsMenu({ children }: { children?: ReactNode }) {
  return (
    <ToolbarMenu trigger={<ToolbarButton icon="ellipsis-vertical" label="Affichage" />} wide>
      <SettingsMenuContent>{children}</SettingsMenuContent>
    </ToolbarMenu>
  );
}

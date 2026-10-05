import { ToolbarButton } from '@/shared/buttons/ToolbarButton';

export const SettingsButton = (props: React.ComponentProps<'button'>) => (
  <ToolbarButton icon="ellipsis-vertical" label="Affichage" {...props} />
);

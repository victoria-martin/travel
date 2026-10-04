import { Button } from '@/shared/buttons/Button';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { ReactNode } from 'react';
import { Icon } from '../Icon';

type ToolbarPanelProps = {
  icon: string;
  label: string;
  count?: number;
  align?: 'left';
  wide?: boolean;
  children: ReactNode;
};
/*
  Port de toolbarPanel (js/views/toolbar/panel.js) : un panneau d'en-tête qui reste ouvert tant
  qu'on interagit avec ses champs — aucun `DropdownMenu.Item`, donc rien ne le referme au choix.
*/
export function ToolbarPanel({ icon, label, count, align, wide, children }: ToolbarPanelProps) {
  const showLabels = window.showButtonLabels();

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        {/* <button type="button" className="btn btn-outline btn-small" title={label}>
          <span className="toolbar-icon">
            <Icon name={icon} />
          </span>
          {showLabels && <span className="toolbar-label">{label}</span>}
          {!!count && <span className="toolbar-count">{count}</span>}
        </button> */}
        <SettingsButton label="Affichage" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={`toolbar-menu ${wide ? 'toolbar-menu-wide' : ''}`}
          align={align === 'left' ? 'start' : 'end'}
          sideOffset={6}
          collisionPadding={8}
        >
          {/* <span>coucou</span> */}
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

type SettingsButtonProps = React.ComponentProps<'button'> & {
  label: string;
};

const SettingsButton = ({ label, ...props }: SettingsButtonProps) => {
  const showLabels = window.showButtonLabels();

  return (
    <Button {...props}>
      <Icon name="ellipsis-vertical" />
      {showLabels && <span className="toolbar-label">{label}</span>}
    </Button>
  );
};

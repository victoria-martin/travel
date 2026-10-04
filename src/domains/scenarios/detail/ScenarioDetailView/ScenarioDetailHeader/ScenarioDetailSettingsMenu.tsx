import { RadioCardField } from '@/shared/form-fields/RadioCardField';
import { SwitchField } from '@/shared/form-fields/SwitchField';
import { Icon } from '@/shared/Icon';
import SettingsButton from '@/shared/settings/SettingsButton';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { ReactNode } from 'react';

// TODO: laisser pr l instan
export function ScenarioDetailSettingsMenu({ children }: { children?: ReactNode }) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <SettingsButton label="Affichage" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="toolbar-menu toolbar-menu-wide"
          align="end"
          sideOffset={6}
          collisionPadding={8}
        >
          <div className="filter-block">
            <p className="filter-title">Réglages généraux</p>
            <SwitchField
              label="Textes des boutons"
              checked={window.showButtonLabels()}
              onChange={() => window.toggleButtonLabels()}
            />
            <RadioCardField
              label="Indicateur hors dispo"
              name="out-of-range-style"
              options={window.OUT_OF_RANGE_STYLES.map((style) => ({
                key: style.key,
                label: style.label,
                preview: (
                  <span className={`oor-badge ${style.modifier}`}>
                    <Icon name="triangle-alert" />
                    {style.showText ? ' Hors dispo' : ''}
                  </span>
                ),
              }))}
              selectedKey={window.outOfRangeStyle().key}
              onChange={(key) => window.setOutOfRangeStyle(key)}
            />
          </div>
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

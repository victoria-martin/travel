import { RadioCardField } from '@/shared/form-fields/RadioCardField';
import { SwitchField } from '@/shared/form-fields/SwitchField';
import { Icon } from '@/shared/Icon';
import { MenuContent } from '@/shared/menu/MenuContent';
import type { ReactNode } from 'react';

export const SettingsMenuContent = ({ children }: { children: ReactNode }) => {
  return (
    <MenuContent>
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
    </MenuContent>
  );
};

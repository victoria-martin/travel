import type { ReactNode } from 'react';
import { Icon } from '../Icon';
import { RadioCardField } from '../form-fields/RadioCardField';
import { SwitchField } from '../form-fields/SwitchField';
import { ToolbarPanel } from './ToolbarPanel';

/*
  Port de toolbarMenu/settingsBlocks (js/views/toolbar/menu.js, js/views/settings/blocks.js) :
  les réglages transverses, puis `children` pour ce qui ne vaut que sur la page ouverte — sous son
  propre titre, posé par l'écran qui l'utilise.
*/
export function SettingsMenu({ children }: { children?: ReactNode }) {
  return (
    <ToolbarPanel icon="ellipsis-vertical" label="Affichage" wide>
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
    </ToolbarPanel>
  );
}

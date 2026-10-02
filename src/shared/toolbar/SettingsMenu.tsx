import { SwitchField } from '../SwitchField';
import { ToolbarPanel } from './ToolbarPanel';

/*
  Port partiel de toolbarMenu/settingsBlocks (js/views/toolbar/menu.js, js/views/settings/blocks.js) :
  seule la préférence vraiment transverse (textes des boutons) est reprise. outOfRangeStyleOption
  ne concerne que les hébergements/scénarios (disponibilité) — hors sujet sur Cities/Charges
  fixes/Transports — et pageSettingsBlock n'a rien à dire sur ces écrans. À étoffer le jour où un
  écran migré en a besoin.
*/
export function SettingsMenu() {
  return (
    <ToolbarPanel icon="ellipsis-vertical" label="Affichage" wide>
      <div className="filter-block">
        <p className="filter-title">Réglages généraux</p>
        <SwitchField
          label="Textes des boutons"
          checked={window.showButtonLabels()}
          onChange={() => window.toggleButtonLabels()}
        />
      </div>
    </ToolbarPanel>
  );
}

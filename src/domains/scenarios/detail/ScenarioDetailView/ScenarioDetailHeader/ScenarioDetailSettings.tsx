import { RadioCardField } from '@/shared/form-fields/RadioCardField';
import { SwitchField } from '@/shared/form-fields/SwitchField';

// Réglages propres au détail d'un scénario, rendus dans le ⋮ de son header.
export function ScenarioDetailSettings() {
  return (
    <div className="filter-block">
      <p className="filter-title">Détail du scénario</p>
      <SwitchField
        label="Afficher le fil"
        checked={window.trailShown()}
        onChange={() => window.toggleTrailShown()}
      />
      <SwitchField
        label="Coloré par type d’hébergement"
        checked={window.trailColorByType()}
        onChange={() => window.toggleTrailColor()}
      />
      <RadioCardField
        label="Zone d’étape"
        name="step-area-shape"
        options={window.STEP_AREA_SHAPES.map((shape) => ({
          key: shape.key,
          label: shape.label,
          preview: <span className={`radio-card-preview-${shape.key}`} />,
        }))}
        selectedKey={window.prefs.stepAreaShape}
        onChange={(key) => window.setStepAreaShape(key)}
      />
      <div className="page-submenu">
        <p className="filter-title">Météo</p>
        <SwitchField
          label="Afficher la météo"
          checked={window.weatherBannerShown()}
          onChange={() => window.toggleWeatherBanner()}
        />
        <RadioCardField
          label="Style"
          name="weather-banner-style"
          options={window.WEATHER_BANNER_STYLES}
          selectedKey={window.weatherBannerStyle()}
          onChange={(style) => window.setWeatherBannerStyle(style)}
        />
      </div>
    </div>
  );
}

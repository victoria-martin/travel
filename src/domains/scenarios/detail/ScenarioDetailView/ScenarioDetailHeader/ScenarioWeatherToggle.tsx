import { Button } from '@/shared/buttons/Button';
import { ToolbarFace } from '@/shared/toolbar/ToolbarFace';

export function ScenarioWeatherToggle() {
  const active = window.weatherBannerShown();
  return (
    <Button
      variant="outline"
      size="small"
      title="Météo"
      className={active ? 'active' : ''}
      onClick={() => window.toggleWeatherBanner()}
    >
      <ToolbarFace icon="cloud" label="Météo" />
    </Button>
  );
}

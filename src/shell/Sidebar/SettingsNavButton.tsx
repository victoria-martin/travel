import { Icon } from '@/shared/Icon';

export function SettingsNavButton() {
  return (
    <button
      type="button"
      className="nav-btn"
      title="Réglages"
      onClick={() => window.openModal('settings')}
    >
      <span className="nav-icon">
        <Icon name="settings" />
      </span>
      <span className="nav-label">Réglages</span>
    </button>
  );
}

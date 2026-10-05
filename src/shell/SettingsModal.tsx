import { SettingsMenuContent } from '@/shared/menu/SettingsMenu/SettingsMenuContent';
import { PageSettings } from './SettingsModal/PageSettings';

export function SettingsModal() {
  return (
    <>
      <h3>Réglages</h3>
      <SettingsMenuContent>
        <PageSettings />
      </SettingsMenuContent>
      <div className="modal-actions">
        <button type="button" className="btn btn-outline" onClick={() => window.closeModal()}>
          Fermer
        </button>
      </div>
    </>
  );
}

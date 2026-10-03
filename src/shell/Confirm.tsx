import { OverlayHost } from '@/shell/OverlayHost';

export const Confirm = () => {
  if (!window.dismissAskOpen) return null;

  return (
    <OverlayHost onClose={() => window.keepEditing()}>
      <div className="modal modal-ask">
        <h3>Enregistrer les modifications ?</h3>
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={() => window.keepEditing()}>
            Annuler
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => window.closeModal()}>
            Ne pas enregistrer
          </button>
          <button type="button" className="btn" onClick={() => window.saveAndClose()}>
            Enregistrer
          </button>
        </div>
      </div>
    </OverlayHost>
  );
};

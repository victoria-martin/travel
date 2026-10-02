import { useEffect } from 'react';

/*
  Port de renderModal/dismissModal (js/modals/modal.js). Le corps est peint via
  dangerouslySetInnerHTML : tant que modal.payload ne change pas (la saisie est non contrôlée,
  lue seulement à l'enregistrement — js/views/inline-edit.js), modalBodyHtml() rend la même
  chaîne à chaque appel, donc React ne retouche jamais ce DOM — un dismissAskOpen qui redéclenche
  render() ailleurs dans l'app ne perd plus la saisie en cours, contrairement au DOM manuel d'avant
  (document.getElementById('app').appendChild(...), jamais revisité par React).
*/
export function ModalHost() {
  const modal = window.modal;
  const bodyHtml = modal ? window.modalBodyHtml() : null;

  useEffect(() => {
    if (modal) window.onModalPainted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyHtml]);

  if (!modal) return null;

  const width = window.modalPanelWidth();

  return (
    <>
      <div
        className={modal.sheet ? 'overlay overlay-sheet' : 'overlay'}
        onClick={(event) => {
          if (event.target === event.currentTarget) window.dismissModal();
        }}
      >
        <div
          className={modal.sheet ? 'modal modal-sheet' : 'modal'}
          style={width ? { maxWidth: width } : undefined}
          dangerouslySetInnerHTML={{ __html: bodyHtml || '' }}
        />
      </div>
      {window.dismissAskOpen && (
        <div
          className="overlay overlay-ask"
          onClick={(event) => {
            if (event.target === event.currentTarget) window.keepEditing();
          }}
        >
          <div className="modal modal-ask">
            <h3>Enregistrer les modifications ?</h3>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => window.closeModal()}>
                Ne pas enregistrer
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => window.keepEditing()}>
                Annuler
              </button>
              <button type="button" className="btn" onClick={() => window.saveAndClose()}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

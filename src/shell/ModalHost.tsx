import { useEffect } from 'react';
import { ActualExpenseForm } from '../domains/expenses/modal/ActualExpenseForm';

/*
  Port de renderModal/dismissModal (js/modals/modal.js). La plupart des types restent peints via
  dangerouslySetInnerHTML : tant que modal.payload ne change pas (la saisie est non contrôlée,
  lue seulement à l'enregistrement — js/views/inline-edit.js), modalBodyHtml() rend la même
  chaîne à chaque appel, donc React ne retouche jamais ce DOM — un dismissAskOpen qui redéclenche
  render() ailleurs dans l'app ne perd plus la saisie en cours, contrairement au DOM manuel d'avant
  (document.getElementById('app').appendChild(...), jamais revisité par React).

  REACT_FORMS porte les types migrés en vrai composant React (pilote : actual-expense) — le reste
  de la mécanique (MODAL_TYPES.open/edits, dirty-check, dismissModal, Entrée/Échap) ne change pas :
  modalFieldsState() (modal.js) lit le DOM générique (input/textarea/select sous .modal), qui
  existe pareil que la forme soit peinte en chaîne ou par un composant.
*/
const REACT_FORMS: Record<string, (props: { payload: any }) => React.JSX.Element> = {
  'actual-expense': ActualExpenseForm,
};

export function ModalHost() {
  const modal = window.modal;
  const ReactForm = modal ? REACT_FORMS[modal.type] : undefined;
  const bodyHtml = modal && !ReactForm ? window.modalBodyHtml() : null;

  useEffect(() => {
    if (modal) window.onModalPainted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal, bodyHtml]);

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
        {ReactForm ? (
          <div className={modal.sheet ? 'modal modal-sheet' : 'modal'} style={width ? { maxWidth: width } : undefined}>
            <ReactForm payload={modal.payload} />
          </div>
        ) : (
          <div
            className={modal.sheet ? 'modal modal-sheet' : 'modal'}
            style={width ? { maxWidth: width } : undefined}
            dangerouslySetInnerHTML={{ __html: bodyHtml || '' }}
          />
        )}
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

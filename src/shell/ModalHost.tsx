import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useEffect } from 'react';
import { REACT_FORMS } from '../forms/react-forms';

/*
  Port de renderModal/dismissModal (js/modals/modal.js), maintenant sur Dialog de Radix (gratuit
  pour les ~20 types encore en dangerouslySetInnerHTML comme pour ceux déjà portés en React —
  Radix ne regarde pas le contenu, juste l'overlay/le focus/le clavier) : focus trap, restauration
  du focus à la fermeture, aria-modal — remplace l'implémentation main.

  `.overlay`/`.modal` gardent leur CSS inchangée (centrage par flex du parent sur l'enfant) en
  nichant Dialog.Content DANS Dialog.Overlay plutôt qu'en frères comme le fait l'exemple Radix par
  défaut — rien n'impose cette forme, Overlay n'est qu'un div stylé.

  Échap et clic dehors appellent dismissModal() (qui vérifie la saisie non enregistrée) via
  preventDefault() sur les callbacks Radix, pas le close automatique — le listener Échap global de
  modal.js se tait alors tout seul (`event.defaultPrevented`, déjà écrit pour ce genre de
  coordination), donc pas de double dismiss.
*/

export function ModalHost() {
  const modal = window.modal;
  const ReactForm = modal ? REACT_FORMS[modal.type] : undefined;
  const bodyHtml = modal && !ReactForm ? window.modalBodyHtml() : null;

  useEffect(() => {
    if (modal) window.onModalPainted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal, bodyHtml]);

  const width = modal ? window.modalPanelWidth() : null;

  return (
    <>
      <Dialog.Root open={!!modal} onOpenChange={(open) => !open && window.dismissModal()}>
        {modal && (
          <Dialog.Portal>
            <Dialog.Overlay className={modal.sheet ? 'overlay overlay-sheet' : 'overlay'}>
              <Dialog.Content
                className={modal.sheet ? 'modal modal-sheet' : 'modal'}
                style={width ? { maxWidth: width } : undefined}
                onEscapeKeyDown={(event) => {
                  event.preventDefault();
                  window.dismissModal();
                }}
                onPointerDownOutside={(event) => {
                  event.preventDefault();
                  window.dismissModal();
                }}
              >
                {/* Titre pour les lecteurs d'écran (Radix l'exige) : masqué visuellement, les
                    formulaires portent déjà leur propre <h3> visible dans leur contenu. */}
                <VisuallyHidden>
                  <Dialog.Title>{modal.type}</Dialog.Title>
                </VisuallyHidden>
                {ReactForm ? (
                  <ReactForm payload={modal.payload} />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: bodyHtml || '' }} />
                )}
              </Dialog.Content>
            </Dialog.Overlay>
          </Dialog.Portal>
        )}
      </Dialog.Root>
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

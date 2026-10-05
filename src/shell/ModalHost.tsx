import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ModalContentContext } from '@/shared/modal/ModalContentContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MODAL_BODIES } from '../modal-bodies';

/*
  La modale globale sur Dialog de Radix, son corps venant de MODAL_BODIES : focus trap,
  restauration du focus à la fermeture, aria-modal.

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
  const Body = modal ? MODAL_BODIES[modal.type] : undefined;

  // Radix mounts the content one pass after this render: the first paint is signalled by the
  // content's own ref, later swaps of an already open modal by the effect.
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentElement, setContentElement] = useState<HTMLDivElement | null>(null);
  const onContentMounted = useCallback((element: HTMLDivElement | null) => {
    contentRef.current = element;
    setContentElement(element);
    if (element && window.modal) window.onModalPainted();
  }, []);
  useEffect(() => {
    if (modal && contentRef.current) window.onModalPainted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal]);

  const width = modal ? window.modalPanelWidth() : null;

  return (
    <Dialog.Root open={!!modal} onOpenChange={(open) => !open && window.dismissModal()}>
      {modal && (
        <Dialog.Portal>
          <Dialog.Overlay className={modal.sheet ? 'overlay overlay-sheet' : 'overlay'}>
            <Dialog.Content
              ref={onContentMounted}
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
              {/* Titre pour les lecteurs d'écran (Radix l'exige) : masqué visuellement, le
                  contenu porte déjà son propre <h3> visible. */}
              <VisuallyHidden>
                <Dialog.Title>{modal.type}</Dialog.Title>
              </VisuallyHidden>
              <ModalContentContext.Provider value={contentElement}>
                {Body && <Body payload={modal.payload} />}
              </ModalContentContext.Provider>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}

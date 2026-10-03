import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import type { KeyboardEvent, ReactNode } from 'react';

type OverlayHostProps = {
  onClose: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  html?: { __html: string };
  children?: ReactNode;
};

/*
  Une question posée par-dessus l'écran en cours — parfois par-dessus une ModalHost déjà ouverte
  (askNewProvider, askNewWord) : elle prend son propre Dialog Radix plutôt qu'un <div> fixed,
  sinon elle hérite du pointer-events:none que Radix pose sur tout ce qui n'est pas le Content de
  la modale déjà ouverte (hideOthers, @radix-ui/react-dialog) — ses boutons deviennent alors
  incliquables. Échap reste géré par le onKeyDown de l'appelant (comportement legacy inchangé),
  on se contente d'empêcher la fermeture par défaut de Radix pour ne pas le court-circuiter.
*/
export const OverlayHost = ({ onClose, onKeyDown, html, children }: OverlayHostProps) => (
  <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
    <Dialog.Portal>
      <Dialog.Overlay className="overlay overlay-ask" onKeyDown={onKeyDown}>
        <Dialog.Content
          onEscapeKeyDown={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => {
            event.preventDefault();
            onClose();
          }}
        >
          <VisuallyHidden>
            <Dialog.Title>Question</Dialog.Title>
          </VisuallyHidden>
          {html ? <div dangerouslySetInnerHTML={html} /> : children}
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  </Dialog.Root>
);

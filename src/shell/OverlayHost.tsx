import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import type { ReactNode } from 'react';

type OverlayHostProps = {
  onClose: () => void;
  onOpened?: () => void;
  children?: ReactNode;
};

/*
  Une question posée par-dessus l'écran en cours — parfois par-dessus une ModalHost déjà ouverte
  (askNewProvider, askNewWord) : elle prend son propre Dialog Radix plutôt qu'un <div> fixed,
  sinon elle hérite du pointer-events:none que Radix pose sur tout ce qui n'est pas le Content de
  la modale déjà ouverte (hideOthers, @radix-ui/react-dialog) — ses boutons deviennent alors
  incliquables. Échap reste géré par le formulaire posé dedans, on empêche la fermeture par défaut
  de Radix pour ne pas le court-circuiter.
  `onOpened` attend que Radix ait monté le contenu (un tour après le rendu) avant de toucher à ses
  champs : appelé plus tôt, il ne les trouverait pas.
*/
export const OverlayHost = ({ onClose, onOpened, children }: OverlayHostProps) => (
  <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
    <Dialog.Portal>
      <Dialog.Overlay className="overlay overlay-ask">
        <Dialog.Content
          onOpenAutoFocus={(event) => {
            if (!onOpened) return;
            event.preventDefault();
            onOpened();
          }}
          onEscapeKeyDown={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => {
            event.preventDefault();
            onClose();
          }}
        >
          <VisuallyHidden>
            <Dialog.Title>Question</Dialog.Title>
          </VisuallyHidden>
          {children}
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  </Dialog.Root>
);

// dismissModal() (pas closeModal()) : redemande « enregistrer les modifications ? » si le

import { Button } from '@/shared/buttons/Button';

// formulaire a `edits: true` et que quelque chose a été tapé — closeModal() fermerait en silence.
export function CloseModalButton() {
  return (
    <Button variant="outline" onClick={() => window.dismissModal()}>
      Annuler
    </Button>
  );
}

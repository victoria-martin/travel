// Port du `<h3>` répété en tête de chaque formulaire : seuls le verbe (création/édition) et le
// sujet varient, jamais la structure de la phrase.
export function ModalTitle({ isNew, subject }: { isNew: boolean; subject: string }) {
  return (
    <h3>
      {isNew ? 'Ajouter' : 'Modifier'} {subject}
    </h3>
  );
}

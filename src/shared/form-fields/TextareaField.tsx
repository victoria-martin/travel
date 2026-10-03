// Port du bloc `.field` répété pour les notes/commentaires en zone de texte.
export function TextareaField({
  id,
  label,
  rows = 2,
  defaultValue,
}: {
  id: string;
  label: string;
  rows?: number;
  defaultValue?: string;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <textarea id={id} rows={rows} defaultValue={defaultValue} />
    </div>
  );
}

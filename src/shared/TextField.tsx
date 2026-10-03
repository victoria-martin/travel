// Port du bloc `.field` répété dans chaque formulaire de modale (label + input texte/date).
export function TextField({
  id,
  label,
  type = 'text',
  defaultValue,
  required,
}: {
  id: string;
  label: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} defaultValue={defaultValue} required={required} />
    </div>
  );
}

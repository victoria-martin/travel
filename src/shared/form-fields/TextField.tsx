// Port du bloc `.field` répété dans chaque formulaire de modale (label + input texte/date).
// `listOptions` couvre le texte libre + suggestions (un `<datalist>`, comme packingCategoryField
// avant son port) — une saisie libre qui peut aussi se compléter, pas un choix fermé (SelectField).
export function TextField({
  id,
  label,
  type = 'text',
  defaultValue,
  required,
  listOptions,
}: {
  id: string;
  label: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  listOptions?: string[];
}) {
  const listId = listOptions ? `${id}-options` : undefined;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} defaultValue={defaultValue} required={required} list={listId} />
      {listOptions && (
        <datalist id={listId}>
          {listOptions.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      )}
    </div>
  );
}

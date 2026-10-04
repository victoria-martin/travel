// Port du bloc `.field` répété dans chaque formulaire de modale (label + input texte/date).
// `listOptions` couvre le texte libre + suggestions (un `<datalist>`) — une saisie libre qui peut
// aussi se compléter, pas un choix fermé (SelectField).
export function TextField({
  id,
  label,
  type = 'text',
  defaultValue,
  required,
  listOptions,
  placeholder,
  title,
  hint,
  onInput,
  onBlur,
  onPaste,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  listOptions?: string[];
  placeholder?: string;
  title?: string;
  hint?: string;
  onInput?: () => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const listId = listOptions ? `${id}-options` : undefined;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        defaultValue={defaultValue}
        required={required}
        list={listId}
        placeholder={placeholder}
        title={title}
        onInput={onInput}
        onBlur={onBlur}
        onPaste={onPaste}
        onChange={onChange}
      />
      {hint && <small className="field-hint">{hint}</small>}
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

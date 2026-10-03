// Port du bloc `.field` répété pour un <select> natif : chaque appelant ne fournit que ses
// propres options (valeur + libellé), jamais la façon dont elles sont dérivées de ses données.
export function SelectField({
  id,
  label,
  defaultValue,
  placeholder,
  options,
}: {
  id: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {/* TODO: composant generique dans /select ? */}
      <select id={id} defaultValue={defaultValue}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Port du bloc `.field` répété pour un <select> natif : chaque appelant ne fournit que ses
// propres options (valeur + libellé), jamais la façon dont elles sont dérivées de ses données.
export function SelectField({
  id,
  label,
  defaultValue,
  placeholder,
  options,
  onChange,
}: {
  id: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} defaultValue={defaultValue} onChange={onChange}>
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

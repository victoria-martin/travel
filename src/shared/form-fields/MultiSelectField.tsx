import type { ReactNode } from 'react';

// A native <select multiple>: several picks without a checklist; `children` sits under it (e.g. an AddByNameRow).
export function MultiSelectField({
  id,
  label,
  options,
  selected,
  emptyHint,
  onChange,
  children,
}: {
  id: string;
  label: string;
  options: { value: string; label: string; disabled?: boolean; title?: string }[];
  selected: string[];
  emptyHint: string;
  onChange: (values: string[]) => void;
  children?: ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {options.length ? (
        <select
          id={id}
          multiple
          size={Math.min(options.length, 6)}
          value={selected}
          onChange={(event) =>
            onChange(Array.from(event.target.selectedOptions).map((option) => option.value))
          }
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              title={option.title}
            >
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <p className="filter-hint">{emptyHint}</p>
      )}
      {children}
    </div>
  );
}

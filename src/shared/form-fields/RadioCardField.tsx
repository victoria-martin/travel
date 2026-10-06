import type { ReactNode } from 'react';

// A closed choice laid out as a row of cards.
export type RadioCardOption = { key: string; label: string; preview?: ReactNode };

export function RadioCardField({
  label,
  name,
  options,
  selectedKey,
  onChange,
}: {
  label: string;
  name: string;
  options: RadioCardOption[];
  selectedKey: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="radio-card-field">
      <span className="radio-card-label">{label}</span>
      <div className="radio-card-grid">
        {options.map((option) => (
          <label
            key={option.key}
            className={`radio-card${selectedKey === option.key ? ' selected' : ''}`}
          >
            <input
              type="radio"
              name={name}
              checked={selectedKey === option.key}
              onChange={() => onChange(option.key)}
            />
            {option.preview && <span className="radio-card-preview">{option.preview}</span>}
            <span className="radio-card-name">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

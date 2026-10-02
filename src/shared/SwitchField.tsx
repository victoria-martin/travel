import type { ReactNode } from 'react';

// Port de switchField (js/views/switch-field.js).
export function SwitchField({
  label,
  checked,
  onChange,
}: {
  label: ReactNode;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="switch-option">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="switch-track" />
      <span className="switch-label">{label}</span>
    </label>
  );
}

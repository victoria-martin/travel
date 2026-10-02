import type { ReactNode } from 'react';
import { Icon } from './Icon';

// Port de switchField (js/views/switch-field.js), avec une icône optionnelle que le legacy n'a
// pas — même slot pour tous les appelants plutôt que chacun compose icône+texte à sa façon.
export function SwitchField({
  icon,
  iconFill,
  label,
  checked,
  onChange,
}: {
  icon?: string;
  iconFill?: boolean;
  label: ReactNode;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="switch-option">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="switch-track" />
      {icon && <Icon name={icon} fill={iconFill} />} <span className="switch-label">{label}</span>
    </label>
  );
}

import type { ReactNode } from 'react';
import { Icon } from '../Icon';

// The optional icon gives every caller the same slot instead of each composing icon and text.
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

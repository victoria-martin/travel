import { Icon } from '../Icon';

// The label shows only when the button-labels preference is on.
export function ToolbarFace({ icon, label }: { icon: string; label: string }) {
  return (
    <>
      <span className="toolbar-icon">
        <Icon name={icon} />
      </span>
      {window.showButtonLabels() && <span className="toolbar-label">{label}</span>}
    </>
  );
}

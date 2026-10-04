import { Icon } from '../Icon';

// Port de toolbarFace (js/views/toolbar/button.js) : icône, libellé seulement si la préférence le veut.
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

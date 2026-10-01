import type { ReactNode } from 'react';
import { Icon } from '../Icon';

/*
  Port de toolbarPanel (js/views/toolbar/panel.js) : un <details> natif, pas de mécanisme
  d'ouverture/positionnement à gérer nous-mêmes (contrairement à inline-dropdown, qui vise le
  viewport). `showButtonLabels()` (préférence legacy) pas encore porté — label toujours affiché.
*/
export function ToolbarPanel({
  icon,
  label,
  count,
  align,
  children,
}: {
  icon: string;
  label: string;
  count?: number;
  align?: 'left';
  children: ReactNode;
}) {
  return (
    <details className="toolbar-panel">
      <summary className="toolbar-btn" title={label}>
        <span className="toolbar-icon">
          <Icon name={icon} />
        </span>
        <span className="toolbar-label">{label}</span>
        {!!count && <span className="toolbar-count">{count}</span>}
      </summary>
      <div className={`toolbar-panel-body ${align === 'left' ? 'toolbar-panel-body-left' : ''}`}>
        {children}
      </div>
    </details>
  );
}

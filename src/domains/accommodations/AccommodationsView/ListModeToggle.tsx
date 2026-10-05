import { ToolbarFace } from '@/shared/toolbar/ToolbarFace';

const MODES = [
  { mode: 'table', icon: 'rows-3', label: 'Tableau' },
  { mode: 'card', icon: 'layout-grid', label: 'Cartes' },
] as const;

// Port de listModeToggle (js/views/list-mode.js): the list mode is a session global, not a preference.
export function ListModeToggle({ kind }: { kind: string }) {
  const current = window.listViewMode[kind];
  return (
    <div className="toggle-group">
      {MODES.map((option) => (
        <button
          type="button"
          key={option.mode}
          className={`btn btn-outline btn-small ${current === option.mode ? 'active' : ''}`}
          title={option.label}
          aria-label={option.label}
          onClick={() => window.setListMode(kind, option.mode)}
        >
          <ToolbarFace icon={option.icon} label={option.label} />
        </button>
      ))}
    </div>
  );
}

import { Icon } from '@/shared/Icon';

const SYNC_STATES: Record<string, { icon: string; tone: string; label: string }> = {
  off: { icon: 'circle', tone: 'sync-off', label: 'Sheet non connecté' },
  pulling: { icon: 'refresh-cw', tone: 'sync-busy', label: 'Lecture du Sheet…' },
  pushing: { icon: 'refresh-cw', tone: 'sync-busy', label: 'Envoi au Sheet…' },
  ok: { icon: 'circle-check', tone: 'sync-ok', label: 'Sheet synchronisé' },
  choice: { icon: 'circle-alert', tone: 'sync-choice', label: 'Choix à faire' },
  error: { icon: 'circle-x', tone: 'sync-error', label: 'Sheet injoignable' },
};

export function SyncStatusButton() {
  const sync = window.sync;
  const current = SYNC_STATES[sync.status] ?? SYNC_STATES.off;
  const label = sync.status === 'error' && sync.message ? sync.message : current.label;
  return (
    <button
      type="button"
      className="nav-btn"
      id="sync-status"
      title={sync.message}
      onClick={() => window.openSyncModal()}
    >
      <span className="nav-icon">
        <span className={current.tone} style={{ display: 'contents' }}>
          <Icon name={current.icon} />
        </span>
      </span>
      <span className="nav-label">{label}</span>
    </button>
  );
}

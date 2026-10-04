import { TextField } from '@/shared/form-fields/TextField';

// `sync` lives outside the store and render() skips an open modal: reading it once at mount is what the legacy form did too.
export function SyncModal() {
  const sync = window.sync;
  const choice = sync.status === 'choice' && !!sync.pendingRemote;
  return (
    <>
      <h3>Synchro Google Sheets</h3>
      <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: -8 }}>
        Colle l&apos;URL de ton application web Apps Script (celle qui finit par{' '}
        <strong>/exec</strong>). Voir <strong>apps-script/Code.js</strong> et le README pour la mise
        en place.
      </p>
      <TextField
        id="sync-url"
        label="URL de l'application web"
        defaultValue={sync.url || sync.lastUrl}
      />
      <p style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
        État : {sync.message || sync.status}
      </p>
      {choice && (
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12, marginTop: 4 }}>
          <p style={{ fontSize: 13 }}>
            <strong>Tes données locales et celles du Sheet diffèrent.</strong> Que garde-t-on comme
            point de départ ?
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn"
              onClick={() => window.resolveSyncChoice('remote')}
            >
              Prendre le Sheet
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => window.resolveSyncChoice('local')}
            >
              Envoyer mes données locales
            </button>
          </div>
        </div>
      )}
      <div className="modal-actions">
        {window.syncActive() && (
          <button type="button" className="btn btn-danger" onClick={() => window.disconnectSync()}>
            Déconnecter
          </button>
        )}
        <button type="button" className="btn btn-outline" onClick={() => window.closeModal()}>
          Fermer
        </button>
        <button type="button" className="btn" id="f-save" onClick={() => window.saveSyncUrl()}>
          Connecter
        </button>
      </div>
    </>
  );
}

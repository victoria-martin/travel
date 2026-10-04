import { CloseModalButton } from '@/shared/modal/CloseModalButton';
import { ModalSaveButton } from '@/shared/modal/ModalSaveButton';

// runPasteImport (legacy) reads #paste-area and does everything itself: import, alert, close.
export function PasteImportModal() {
  const knownNames = window.IMPORT_FIELDS.map(
    (field) => field.labels[0][0].toUpperCase() + field.labels[0].slice(1),
  ).join(' · ');
  const columnOrder = window.PASTE_COLUMN_ORDER.map((key) => window.fieldLabel(key));
  const types = Object.values(window.ACCOMMODATION_TYPES)
    .map((type) => `"${type.label}"`)
    .join(', ');
  return (
    <>
      <h3>Importer depuis un tableau</h3>
      <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: -8 }}>
        Copie tes lignes depuis Google Sheets ou Excel,{' '}
        <strong>avec la ligne d&apos;en-tête</strong> : les colonnes sont reconnues par leur nom,
        dans n&apos;importe quel ordre. Noms compris : <br />
        <strong>{knownNames}</strong>
        <br />
        Sans en-tête, l&apos;ordre attendu est <strong>{columnOrder.join(' · ')}</strong>. Type
        accepte {types} (laissé vide si la colonne ne correspond à rien).
      </p>
      <div className="field">
        <textarea
          id="paste-area"
          rows={10}
          placeholder={columnOrder.join('\t')}
          style={{ fontFamily: 'monospace', fontSize: 12 }}
        />
        <small className="field-hint">
          {[
            'ex. hotel',
            'Antico Casale',
            'Sarzana',
            'Ligurie',
            '152',
            '21/09',
            'https://...',
            'Super, pack remboursable',
          ].join('\u00a0\u00a0')}
        </small>
      </div>
      <div id="paste-preview" style={{ fontSize: 12.5, color: 'var(--ink-soft)' }} />
      <div className="modal-actions">
        <CloseModalButton />
        <ModalSaveButton onClick={() => window.runPasteImport()} />
      </div>
    </>
  );
}

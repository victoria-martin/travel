export function ImportActions({
  hasRows,
  selectedCount,
  onImport,
}: {
  hasRows: boolean;
  selectedCount: number;
  onImport: () => void;
}) {
  return (
    <div className="modal-actions">
      <button type="button" className="btn btn-ghost" onClick={() => window.closeModal()}>
        Annuler
      </button>
      {hasRows && (
        <button
          type="button"
          className="btn"
          id="f-save"
          disabled={selectedCount === 0}
          onClick={onImport}
        >
          Importer ({selectedCount})
        </button>
      )}
    </div>
  );
}

export function CloseModalButton() {
  return (
    <button type="button" className="btn btn-ghost" onClick={() => window.closeModal()}>
      Annuler
    </button>
  );
}

export function ImportButton({
  hasRows,
  selectedCount,
  onImport,
}: {
  hasRows: boolean;
  selectedCount: number;
  onImport: () => void;
}) {
  return (
    <div className="modal-actions">
      <button type="button" className="btn btn-ghost" onClick={() => window.closeModal()}>
        Annuler
      </button>
      {hasRows && (
        <button
          type="button"
          className="btn"
          id="f-save"
          disabled={selectedCount === 0}
          onClick={onImport}
        >
          Importer ({selectedCount})
        </button>
      )}
    </div>
  );
}

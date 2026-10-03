export function ImportButton({
  hasRows,
  selectedCount,
  onImport,
}: {
  hasRows: boolean;
  selectedCount: number;
  onImport: () => void;
}) {
  if (!hasRows) {
    return null;
  }

  return (
    <button
      type="button"
      className="btn"
      id="f-save"
      disabled={selectedCount === 0}
      onClick={onImport}
    >
      Importer {selectedCount} éléments
    </button>
  );
}

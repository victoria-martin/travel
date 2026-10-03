export function ImportFileField({
  error,
  onFile,
}: {
  error: string;
  onFile: (file: File) => void;
}) {
  return (
    <div className="field">
      <label htmlFor="import-expenses-file">Fichier CSV</label>
      <input
        id="import-expenses-file"
        type="file"
        accept=".csv,text/csv"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
        }}
      />
      <small className="field-hint">
        Colonnes reconnues : Date, Dépense (ou Libellé simplifié), Montant (ou Débit), Catégorie,
        Sous-catégorie, Adresse, Notes — dans n'importe quel ordre, avec une ligne d'en-tête.
      </small>
      {error && <p style={{ color: 'var(--rust)', fontSize: '13px' }}>{error}</p>}
    </div>
  );
}

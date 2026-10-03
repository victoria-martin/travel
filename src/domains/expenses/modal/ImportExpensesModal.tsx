import { ImportButton } from '@/shared/import/ImportButton';
import { CloseModalButton } from '@/shared/modal/CloseModalButton';
import { useState } from 'react';
import { ImportFileField } from './ImportExpensesModal/ImportFileField';
import { ImportRowsTable } from './ImportExpensesModal/ImportRowsTable';
import { parseExpensesCsv, type ParsedExpenseRow } from './ImportExpensesModal/parse-csv';

export function ImportExpensesModal() {
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState<ParsedExpenseRow[]>([]);
  const [error, setError] = useState('');

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseExpensesCsv(String(reader.result || ''));
      if (parsed.length === 0) {
        setError('Aucune ligne trouvée dans ce fichier.');
        setRows([]);
        return;
      }
      setError('');
      setFileName(file.name);
      setRows(parsed);
    };
    reader.readAsText(file);
  }

  function toggleRow(index: number) {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, selected: !row.selected } : row,
      ),
    );
  }

  function toggleAll(selected: boolean) {
    setRows((current) => current.map((row) => (row.valid ? { ...row, selected } : row)));
  }

  function importSelected() {
    const travelId = window.currentTravelId();
    rows
      .filter((row) => row.selected && row.valid)
      .forEach((row) => {
        window.state.actualExpenses.push({
          id: window.uid(),
          travelId,
          date: row.date,
          label: row.label,
          amount: row.amount,
          fixedCostId: '',
          category: row.category,
          subCategory: row.subCategory,
          address: row.address,
          notes: row.notes,
        });
      });
    window.saveNow();
    window.closeModal();
  }

  const selectedCount = rows.filter((row) => row.valid && row.selected).length;

  return (
    <>
      <h3>Importer des dépenses depuis un fichier</h3>
      <div className="modal-body-scroll">
        {rows.length === 0 ? (
          <ImportFileField error={error} onFile={handleFile} />
        ) : (
          <ImportRowsTable
            fileName={fileName}
            rows={rows}
            onToggleRow={toggleRow}
            onToggleAll={toggleAll}
          />
        )}
      </div>
      <div className="modal-actions">
        <CloseModalButton />
        <ImportButton
          hasRows={rows.length > 0}
          selectedCount={selectedCount}
          onImport={importSelected}
        />
      </div>
    </>
  );
}

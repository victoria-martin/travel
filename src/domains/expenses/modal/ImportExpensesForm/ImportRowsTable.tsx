import type { ParsedExpenseRow } from './parse-csv';

export function ImportRowsTable({
  fileName,
  rows,
  onToggleRow,
  onToggleAll,
}: {
  fileName: string;
  rows: ParsedExpenseRow[];
  onToggleRow: (index: number) => void;
  onToggleAll: (selected: boolean) => void;
}) {
  const validRows = rows.filter((row) => row.valid);
  const selectedCount = validRows.filter((row) => row.selected).length;

  return (
    <>
      <p style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>
        {fileName} · {rows.length} ligne(s) · coche celles à importer — la première est cochée à
        titre d'exemple.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={validRows.length > 0 && selectedCount === validRows.length}
                  onChange={(event) => onToggleAll(event.target.checked)}
                />
              </th>
              <th>Date</th>
              <th>Dépense</th>
              <th>Catégorie</th>
              <th>Montant</th>
              <th>Adresse</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={row.selected}
                    disabled={!row.valid}
                    onChange={() => onToggleRow(index)}
                  />
                </td>
                <td>{row.date || '—'}</td>
                <td>{row.label || '—'}</td>
                <td>{[row.category, row.subCategory].filter(Boolean).join(' · ') || '—'}</td>
                <td>{row.amount ? window.formatEuros(window.priceNumber(row.amount)) : '—'}</td>
                <td>{row.address || '—'}</td>
                <td>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

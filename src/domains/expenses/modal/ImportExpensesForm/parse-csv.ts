export interface ParsedExpenseRow {
  date: string;
  label: string;
  amount: string;
  category: string;
  subCategory: string;
  address: string;
  notes: string;
  selected: boolean;
  valid: boolean;
}

type ExpenseField = 'date' | 'label' | 'amount' | 'category' | 'subCategory' | 'address' | 'notes';

// Les libellés "date operation" / "debit" / "libelle simplifie" couvrent l'export CSV des banques
// françaises (type Boursorama) : date d'opération plutôt que de comptabilisation, montant au
// débit plutôt qu'au crédit (une ligne au crédit — un virement reçu — reste donc hors import).
const FIELD_LABELS: Record<ExpenseField, string[]> = {
  date: ['date', 'date operation', 'date de comptabilisation'],
  label: ['libelle', 'libelle simplifie', 'label', 'nom', 'depense', 'description'],
  amount: ['montant', 'amount', 'prix', 'debit'],
  category: ['categorie', 'category'],
  subCategory: ['sous categorie', 'sous-categorie', 'subcategory'],
  address: ['adresse', 'address'],
  notes: ['notes', 'note', 'commentaire', 'commentaires', 'informations complementaires'],
};

const DEFAULT_COLUMN_ORDER: ExpenseField[] = ['date', 'label', 'amount', 'notes'];

function normalizeHeaderCell(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();
}

function detectDelimiter(line: string): string {
  return line.split(';').length > line.split(',').length ? ';' : ',';
}

function splitCsvLine(line: string, delimiter: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells.map((cell) => cell.trim());
}

// Un en-tête n'est fiable que s'il nomme la colonne qu'on ne peut pas deviner : le libellé.
// Une colonne reconnue deux fois (ex. "Date de comptabilisation" puis "Date operation") garde la
// dernière lue, donc lister la plus précise en second dans FIELD_LABELS pour ce champ.
function headerColumnOrder(cells: string[]): (ExpenseField | null)[] | null {
  const mapping = cells.map((cell) => {
    const normalized = normalizeHeaderCell(cell);
    return (
      (Object.keys(FIELD_LABELS) as ExpenseField[]).find((field) =>
        FIELD_LABELS[field].includes(normalized),
      ) || null
    );
  });
  return mapping.includes('label') ? mapping : null;
}

function normalizeDate(raw: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const frenchMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!frenchMatch) return raw;
  const [, day, month, yearRaw] = frenchMatch;
  const year = yearRaw.length === 2 ? `20${yearRaw}` : yearRaw;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export function parseExpensesCsv(text: string): ParsedExpenseRow[] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];

  const delimiter = detectDelimiter(lines[0]);
  const header = headerColumnOrder(splitCsvLine(lines[0], delimiter));
  const columnOrder = header || DEFAULT_COLUMN_ORDER;
  const dataLines = header ? lines.slice(1) : lines;

  return dataLines.map((line, index) => {
    const cells = splitCsvLine(line, delimiter);
    const fields: Partial<Record<ExpenseField, string>> = {};
    columnOrder.forEach((key, cellIndex) => {
      if (key) fields[key] = (cells[cellIndex] || '').trim();
    });
    const label = fields.label || '';
    const amount = fields.amount || '';
    return {
      date: fields.date ? normalizeDate(fields.date) : '',
      label,
      amount,
      category: fields.category || '',
      subCategory: fields.subCategory || '',
      address: fields.address || '',
      notes: fields.notes || '',
      selected: index === 0,
      valid: label.length > 0 && amount.length > 0,
    };
  });
}

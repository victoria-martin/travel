// Port de textCell (js/views/cells/text-cell.js).
export function TextCell({ value }: { value: string }) {
  return <>{value || '—'}</>;
}

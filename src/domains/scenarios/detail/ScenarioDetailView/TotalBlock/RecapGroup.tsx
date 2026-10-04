import { LegacyMarkup } from '@/shared/LegacyMarkup';
import { RecapRow } from './RecapRow';

// A family folds on its own; its amount reads on its title whether open or not, and again at its foot.
export function RecapGroup({
  foldKey,
  title,
  total,
  rowsHtml,
}: {
  foldKey: string;
  title: string;
  total: string;
  rowsHtml: string;
}) {
  return (
    <details
      className="acc-recap-fold"
      open={window.prefs.recapFolds[foldKey] !== false}
      onToggle={(event) => window.setRecapFold(foldKey, event.currentTarget.open)}
    >
      <summary className="acc-recap-row">
        <span>{title}</span>
        <span></span>
        <strong>{total}</strong>
      </summary>
      <LegacyMarkup html={rowsHtml} />
      <RecapRow
        label={`Total ${title.toLowerCase()}`}
        amount={total}
        className="acc-recap-sub acc-recap-subtotal"
      />
    </details>
  );
}

import type { ReactNode } from 'react';
import { RecapRow } from '@/domains/scenarios/recap/RecapRow';

// A family folds on its own; its amount reads on its title whether open or not, and again at its foot.
export function RecapGroup({
  foldKey,
  title,
  total,
  children,
}: {
  foldKey: string;
  title: string;
  total: string;
  children: ReactNode;
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
      {children}
      <RecapRow
        label={`Total ${title.toLowerCase()}`}
        amount={total}
        className="acc-recap-sub acc-recap-subtotal"
      />
    </details>
  );
}

import type { ReactNode } from 'react';

// Port de `.field-row` : deux champs côte à côte (ex. Catégorie / Sous-catégorie).
export function FieldRow({ children }: { children: ReactNode }) {
  return <div className="field-row">{children}</div>;
}

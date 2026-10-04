import type { ReactNode } from 'react';

export function TableHeaderActions({ children }: { children: ReactNode }) {
  return <div className="table-header-actions">{children}</div>;
}

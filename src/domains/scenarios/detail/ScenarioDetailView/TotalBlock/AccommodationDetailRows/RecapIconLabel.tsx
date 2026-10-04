import type { ReactNode } from 'react';

// Every detail row opens on the same gutter, so names align whether a row carries an icon or not.
export function RecapIconLabel({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <>
      <span className="acc-recap-icon">{icon}</span>
      {children}
    </>
  );
}

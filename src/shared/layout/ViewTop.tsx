import type { ReactNode } from 'react';

// The page's sticky top block: the header and whatever bands must stay on screen with it.
export function ViewTop({ children }: { children: ReactNode }) {
  return <div className="view-top">{children}</div>;
}

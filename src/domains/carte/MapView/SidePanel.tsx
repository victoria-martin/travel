import type { ReactNode } from 'react';

// Chrome commun à Legend/ScenarioPanel/FilterPanel (classes .map-side-panel/.map-side-title,
// propres à la Carte — pas promu à src/shared, rien en dehors de ce domaine ne les utilise).
export function SidePanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="map-side-panel">
      <div className="map-side-title">{title}</div>
      {children}
    </div>
  );
}

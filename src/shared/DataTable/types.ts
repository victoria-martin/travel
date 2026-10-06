import type { ReactNode } from 'react';

/*
  Remplace COLUMN_SETS (js/columns.js) pour les écrans React : `render` est un composant, pas une
  chaîne HTML — chaque cellule reste composée par le domaine, DataTable ne porte que le chrome
  (tri, rendu des lignes). Pas encore de colonnes masquables/sortOrder dictionnaire : premier lot,
  voir docs/archivé/react-migration-plan.md § 7.
*/
export interface Column<T> {
  key: string;
  label: string;
  locked?: boolean;
  sortValue?: (item: T) => string | number;
  render: (item: T) => ReactNode;
}

import type { PackingItem } from '@/store/types';

// Port de groupPackingByCategory (js/views/packing/group.js), spécialisé au catalogue — le seul
// consommateur côté React pour l'instant (composer/onglet scénario restent legacy).
export const UNCATEGORIZED = 'Sans catégorie';

export interface PackingGroup {
  category: string;
  items: PackingItem[];
}

export function groupPackingByCategory(items: PackingItem[]): PackingGroup[] {
  const groups = new Map<string, PackingItem[]>();
  items.forEach((item) => {
    const category = item.category || UNCATEGORIZED;
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category)?.push(item);
  });
  return Array.from(groups.entries())
    .sort(([a], [b]) => {
      if (a === UNCATEGORIZED) return 1;
      if (b === UNCATEGORIZED) return -1;
      return a.localeCompare(b, 'fr');
    })
    .map(([category, groupItems]) => ({ category, items: groupItems }));
}

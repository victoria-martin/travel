// Port de groupPackingByCategory (js/views/packing/group.js) : le catalogue et la valise d'un voyage
// ne lisent pas leur catégorie au même endroit, d'où `categoryOf`.
export const UNCATEGORIZED = 'Sans catégorie';

export interface PackingGroup<T> {
  category: string;
  items: T[];
}

export function groupPackingByCategory<T>(
  items: T[],
  categoryOf: (item: T) => string,
): PackingGroup<T>[] {
  const groups = new Map<string, T[]>();
  items.forEach((item) => {
    const category = categoryOf(item) || UNCATEGORIZED;
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category)?.push(item);
  });
  return Array.from(groups.entries())
    .sort(([categoryA], [categoryB]) => {
      if (categoryA === UNCATEGORIZED) return 1;
      if (categoryB === UNCATEGORIZED) return -1;
      return categoryA.localeCompare(categoryB, 'fr');
    })
    .map(([category, groupItems]) => ({ category, items: groupItems }));
}

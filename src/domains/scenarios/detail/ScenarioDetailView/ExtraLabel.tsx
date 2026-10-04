import { Icon } from '@/shared/Icon';
import { TagLabel } from '@/shared/TagLabel';
import type { Extra } from '@/store/types';

// An attraction or an expense by its icon and name, or what was deleted under the reference.
export function ExtraLabel({ line }: { line: Extra }) {
  const attraction = line.attractionId ? window.getAttraction(line.attractionId) : undefined;
  if (attraction)
    return (
      <TagLabel emoji={window.attractionType(attraction.type).emoji} label={attraction.name} />
    );
  const cost = line.costId ? window.getFixedCost(line.costId) : undefined;
  if (cost)
    return (
      <>
        <span className="inline-emoji">
          <Icon name="wallet" />
        </span>
        <span className="inline-label">{window.costLabel(cost)}</span>
      </>
    );
  return <TagLabel emoji="❔" label={line.costId ? 'Dépense supprimée' : 'Activité supprimée'} />;
}

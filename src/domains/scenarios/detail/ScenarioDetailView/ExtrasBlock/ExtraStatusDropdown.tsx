import { OpenResourceMenuItem } from '@/shared/select/OpenResourceMenuItem';
import { TagDropdown } from '@/shared/select/TagDropdown';
import type { Attraction } from '@/store/types';

export function ExtraStatusDropdown({ attraction }: { attraction: Attraction }) {
  return (
    <TagDropdown
      className="status-dropdown"
      dict={window.ATTRACTION_STATUSES}
      current={window.attractionStatus(attraction.status)}
      beforeItems={
        <OpenResourceMenuItem onSelect={() => window.openAttractionSheet(attraction.id)} />
      }
      onPick={(key) => window.setAttractionStatus(attraction.id, key)}
    />
  );
}

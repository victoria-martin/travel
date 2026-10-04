import { Icon } from '@/shared/Icon';

// The step's own dates against the accommodation's availability window.
export function StepAvailabilityBadge({ reason }: { reason: string | null }) {
  if (!reason) return null;
  const style = window.outOfRangeStyle();
  return (
    <span className={`oor-badge ${style.modifier}`} title={reason}>
      <Icon name="triangle-alert" />
      {style.showText ? ' Hors dispo' : ''}
    </span>
  );
}

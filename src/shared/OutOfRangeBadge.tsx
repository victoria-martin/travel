import { Icon } from '@/shared/Icon';

// An accommodation searched or booked outside its availability window; the reason is its tooltip.
export function OutOfRangeBadge({ reason }: { reason: string | null }) {
  if (!reason) return null;
  const style = window.outOfRangeStyle();
  return (
    <span className={`oor-badge ${style.modifier}`} title={reason}>
      <Icon name="triangle-alert" />
      {style.showText ? ' Hors dispo' : ''}
    </span>
  );
}

import { Icon } from '@/shared/Icon';

// The search date of the listing against its availability window.
export function OutOfRangeBanner({ reason }: { reason: string | null }) {
  if (!reason) return null;
  return (
    <div className={`oor-banner ${window.outOfRangeStyle().modifier}`}>
      <Icon name="triangle-alert" /> {reason}
    </div>
  );
}

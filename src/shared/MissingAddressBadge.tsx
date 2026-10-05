import { Icon } from '@/shared/Icon';

export function MissingAddressBadge({ address }: { address: string }) {
  if (address) return null;
  return (
    <span className="warning-badge" title="Pas d'adresse renseignée">
      <Icon name="triangle-alert" />
    </span>
  );
}

import { Button, type ButtonVariants } from '@/shared/buttons/Button';
import { Icon } from '@/shared/Icon';

// A header button: its icon, its label when the preference shows labels, and a count when set.
type ToolbarButtonProps = React.ComponentProps<'button'> & {
  icon: string;
  label: string;
  variant?: ButtonVariants;
  count?: number;
};

export const ToolbarButton = ({ icon, count, label, variant, ...props }: ToolbarButtonProps) => {
  const showLabels = window.showButtonLabels();
  return (
    <Button title={label} {...props} size="small" variant={variant}>
      <Icon name={icon} />
      {showLabels && <span className="toolbar-label">{label}</span>}
      {!!count && <span className="toolbar-count">{count}</span>}
    </Button>
  );
};

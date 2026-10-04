import { Icon } from '@/shared/Icon';
import { Button } from '@/shared/buttons/Button';

type SettingsButtonProps = React.ComponentProps<'button'> & {
  label: string;
};

const SettingsButton = ({ label, ...props }: SettingsButtonProps) => {
  const showLabels = window.showButtonLabels();

  return (
    <Button {...props}>
      <Icon name="ellipsis-vertical" />
      {showLabels && <span className="toolbar-label">{label}</span>}
    </Button>
  );
};

export default SettingsButton;

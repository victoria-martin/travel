import { Icon } from '@/shared/Icon';
import { Button } from '@/shared/buttons/Button';

type SettingsButtonProps = React.ComponentProps<'button'>;

const SettingsButton = ({ ...props }: SettingsButtonProps) => {
  const showLabels = window.showButtonLabels();

  return (
    <Button {...props}>
      <Icon name="ellipsis-vertical" />
      {showLabels && <span className="toolbar-label">Affichage</span>}
    </Button>
  );
};

export default SettingsButton;

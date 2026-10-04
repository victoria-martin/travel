import { Button } from '@/shared/buttons/Button';
import { Icon } from '@/shared/Icon';

type IconButtonProps = {
  // children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'outline' | 'danger' | 'ghost';
  // size?: 'default' | 'small' | 'square';
  icon: string;
};

// un bouton avec juste une icône - on veut garder, à tester
export const IconButton = ({ onClick, variant, icon }: IconButtonProps) => {
  return (
    <Button onClick={onClick} size="square" variant={variant}>
      <span className="toolbar-icon">
        <Icon name={icon} />
      </span>
    </Button>
  );
};

import { Icon } from '@/shared/Icon';
import { Button } from '@/shared/buttons/Button';

type AddResourceButtonProps = {
  title: string;
  onClick: () => void;
  label: string;
};

export const AddResourceButton = ({ title, onClick, label }: AddResourceButtonProps) => {
  return (
    <Button variant="primary" onClick={onClick}>
      <Icon name="plus" />
      {label}
    </Button>
  );
};

import { IconButton } from '@/shared/buttons/IconButton';

type AddResourceButtonProps = {
  title: string;
  onClick: () => void;
  label: string;
};

export const AddResourceButton = ({ title, onClick, label }: AddResourceButtonProps) => {
  return <IconButton icon="plus" title={title} onClick={onClick} label={label} />;
};

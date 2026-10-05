import { ToolbarButton } from '@/shared/buttons/Button';

type AddResourceButtonProps = {
  title: string;
  onClick: () => void;
  label: string;
};

export const AddResourceButton = ({ title, onClick, label }: AddResourceButtonProps) => {
  const showLabels = window.showButtonLabels();

  // eslint-disable-next-line no-console -- debug temporaire
  console.log('label :', label);

  return (
    <ToolbarButton onClick={onClick} icon="plus" label="Ajouter" variant="primary"></ToolbarButton>
    // <Button
    //   title={title}
    //   data-test-id="add-ressource-button"
    //   variant="primary"
    //   size="small"
    // >
    //   <Icon name="plus" />
    //   {showLabels && label}
    // </Button>
  );
};

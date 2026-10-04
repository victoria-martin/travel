import { Icon } from '@/shared/Icon';

type ButtonWithIconProps = {
  title: string;
  onClick: () => void;
  icon: string;
  label: string;
};

// est ce quon garde ca ou est ce qu on le remplace par un Button avec icon
export const ButtonWithIcon = ({ title, onClick, icon, label }: ButtonWithIconProps) => {
  return (
    <button type="button" className="btn btn-small" title={title} onClick={onClick}>
      <span className="toolbar-icon">
        <Icon name={icon} />
      </span>
      <span className="toolbar-label">{label}</span>
    </button>
  );
};

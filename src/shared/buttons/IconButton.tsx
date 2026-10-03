import { Icon } from '@/shared/Icon';

type IconButtonProps = {
  title: string;
  onClick: () => void;
  icon: string;
  label: string;
};

export const IconButton = ({ title, onClick, icon, label }: IconButtonProps) => {
  return (
    <button type="button" className="toolbar-btn" title={title} onClick={onClick}>
      <span className="toolbar-icon">
        <Icon name={icon} />
      </span>
      <span className="toolbar-label">{label}</span>
    </button>
  );
};

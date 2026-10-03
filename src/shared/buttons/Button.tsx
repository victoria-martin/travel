import clsx from 'clsx';

type ButtonProps = {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'ghost' | 'danger' | 'text';
  size?: 'default' | 'small' | 'square';
};

export const Button = ({ label, onClick, variant = 'default', size = 'default' }: ButtonProps) => {
  const className = clsx(
    'btn',
    variant !== 'default' && `btn-${variant}`,
    size !== 'default' && `btn-${size}`,
  );
  return (
    <button type="button" className={className} onClick={onClick}>
      {label}
    </button>
  );
};

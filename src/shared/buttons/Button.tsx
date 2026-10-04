import { Icon } from '@/shared/Icon';
import { cva } from 'class-variance-authority';

const button = cva('btn', {
  variants: {
    variant: {
      primary: '',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
      danger: 'btn-danger',
      ghost: 'btn-ghost',
      ghostDanger: 'btn-ghost-danger',
      outlineDanger: 'btn-outline-danger',
      link: 'btn-link',
    },
    size: {
      default: '',
      small: 'btn-small',
      square: 'btn-square',
    },
  },
  defaultVariants: {
    variant: 'outline',
    size: 'default',
  },
});

type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'danger'
    | 'ghost'
    | 'ghostDanger'
    | 'outlineDanger'
    | 'link';
  size?: 'default' | 'small' | 'square';
  className?: string;
  title?: string;
  ariaLabel?: string;
};

export const Button = ({
  children,
  onClick,
  variant,
  size,
  className,
  title,
  ariaLabel,
}: ButtonProps) => {
  return (
    <button
      type="button"
      title={title}
      aria-label={ariaLabel}
      onClick={onClick}
      className={button({ variant, size }) + (className ? ` ${className}` : '')}
    >
      {children}
    </button>
  );
};

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

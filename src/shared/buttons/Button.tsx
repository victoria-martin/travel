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
      square: 'btn-square', //peut etre juste passer la classe dans IconButton et retirer cette size
    },
  },
  defaultVariants: {
    variant: 'outline',
    size: 'default',
  },
});

export type ButtonVariants =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'danger'
  | 'ghost'
  | 'ghostDanger'
  | 'outlineDanger'
  | 'link';

type ButtonProps = React.ComponentProps<'button'> & {
  variant?: ButtonVariants;
  size?: 'default' | 'small' | 'square';
  ariaLabel?: string;
  children: React.ReactNode;
};

export const Button = ({
  variant,
  size,
  className,
  ariaLabel,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      {...props}
      className={button({ variant, size }) + (className ? ` ${className}` : '')}
    >
      {children}
    </button>
  );
};

// not sure i need
type ToolbarButtonProps = React.ComponentProps<'button'> & {
  icon: string;
  label: string;
  variant?: ButtonVariants;
  count?: number;
};
export const ToolbarButton = ({ icon, count, label, variant, ...props }: ToolbarButtonProps) => {
  const showLabels = window.showButtonLabels();

  return (
    <Button {...props} size="small" variant={variant}>
      <Icon name={icon} />
      {showLabels && <span className="toolbar-label">{label}</span>}
      {!!count && <span className="toolbar-count">{count}</span>}
    </Button>
  );
};

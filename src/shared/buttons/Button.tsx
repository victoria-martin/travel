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

type ButtonProps = React.ComponentProps<'button'> & {
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
  ariaLabel?: string;
};

export const Button = ({ variant, size, className, ariaLabel, ...props }: ButtonProps) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      {...props}
      className={button({ variant, size }) + (className ? ` ${className}` : '')}
    />
  );
};

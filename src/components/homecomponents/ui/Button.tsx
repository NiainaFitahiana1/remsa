import { ButtonHTMLAttributes } from 'react';

export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type Size = 'default' | 'lg' | 'xl';

// On exporte l'interface (ou type) pour pouvoir la réutiliser
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-primary hover:bg-red-600 text-white',
  secondary: 'bg-secondary-blue hover:bg-slate-800 text-white',
  outline: 'border-2 border-secondary-blue text-secondary-blue hover:bg-secondary-blue hover:text-white dark:border-slate-700 dark:text-slate-300',
  ghost: 'text-slate-600 hover:text-primary dark:text-slate-400',
};

const sizeStyles: Record<Size, string> = {
  default: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-4 text-base',
  xl: 'px-10 py-5 text-base',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'default',
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`
        font-bold uppercase tracking-widest 
        transition-all active:scale-95 rounded-sm
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
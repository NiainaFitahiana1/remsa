import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, containerClassName = '', className = '', ...props }, ref) => {
    return (
      <div className={containerClassName}>
        {label && (
          <label className="mb-1.5 block text-sm font-semibold text-navy dark:text-slate-200">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            form-input
            h-12 w-full rounded border border-slate-200 bg-slate-custom px-4 text-sm
            text-navy placeholder:text-slate-400 transition-all
            focus:border-primary focus:outline-none focus:ring-0
            dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-100
            ${className}
          `}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
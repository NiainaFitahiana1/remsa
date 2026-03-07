import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
}

// Input.tsx
export const Input = forwardRef<HTMLInputElement, InputProps & {
  rightElement?: React.ReactNode;
}>(
  ({ label, containerClassName = '', className = '', rightElement, ...props }, ref) => {
    return (
      <div className={containerClassName}>
        {label && (
          <label className="mb-1.5 block text-sm font-semibold text-navy dark:text-slate-200">
            {label}
          </label>
        )}
        <div className="relative"> {/* ← relative ici */}
          <input
            ref={ref}
            className={`
              form-input
              h-12 w-full rounded border border-slate-200 bg-slate-custom px-4 text-sm
              text-navy placeholder:text-slate-400 transition-all
              focus:border-primary focus:outline-none focus:ring-0
              dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-100
              ${rightElement ? 'pr-10' : ''}   // ← conditionnel
              ${className}
            `}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-0 top-0 bottom-0 flex items-center pr-3 pointer-events-none">
              {rightElement}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
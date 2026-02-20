import { useState, forwardRef, InputHTMLAttributes } from 'react';
import { Icon } from '@/components/homecomponents/ui/Icon'; // suppose que tu as ce composant

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div>
        {label && (
          <label className="mb-1.5 block text-sm font-semibold text-navy dark:text-slate-200">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className="
              h-12 w-full rounded border border-slate-200 bg-slate-custom px-4 text-sm
              text-navy placeholder:text-slate-400 transition-all
              focus:border-primary focus:outline-none focus:ring-0
              dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-100
              pr-11
            "
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy dark:hover:text-slate-200"
          >
            <Icon name={showPassword ? 'visibility_off' : 'visibility'} size="text-xl" />
          </button>
        </div>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
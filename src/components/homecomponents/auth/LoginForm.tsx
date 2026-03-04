'use client';

import { useState } from 'react';
import { useLogin } from '@/hooks/useLogin';
import { Input } from '@/components/homecomponents/ui/Input';
import { Button } from '@/components/homecomponents/ui/Button';
import Image from 'next/image';
import logo from '@/../public/logos/logo-text.png';

import { Eye, EyeOff } from 'lucide-react';

export const LoginForm = () => {
  const { login, isLoading, error } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Note : ton hook useLogin n'accepte pas rememberMe → à ajouter si besoin côté backend
    await login({ email, password });
  };

  return (
    <div className="w-full max-w-[400px] rounded border border-slate-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-8 flex items-center justify-center gap-5">
        <Image
          src={logo}
          alt="e-kalité.mg"
          width={200}
          height={90}
          className="object-cover h-20 -ml-1"
          priority
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          id="email"
          placeholder="e.g. name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />

        {/* Password field avec toggle visibility */}
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="pr-10" // espace pour le bouton œil
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              text-slate-500 hover:text-slate-700
              dark:text-slate-400 dark:hover:text-slate-200
              focus:outline-none focus:text-primary
              transition-colors
            "
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800/50">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20 disabled:opacity-50"
              disabled={isLoading}
            />
            <span className="text-xs font-medium text-slate-600 transition-colors group-hover:text-navy dark:text-slate-400">
              Remember me
            </span>
          </label>

          <a
            href="#"
            className="text-xs font-semibold text-navy hover:underline dark:text-primary"
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          className="w-full py-3.5 text-base shadow-sm transition-opacity"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                />
              </svg>
              Connexion...
            </div>
          ) : (
            'Login'
          )}
        </Button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100 dark:border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-slate-400 dark:bg-zinc-900">or</span>
        </div>
      </div>

      <button
        type="button"
        className="
          flex w-full items-center justify-center gap-2 rounded bg-white py-3 font-medium text-navy
          transition-colors hover:bg-slate-50
          dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-200 dark:hover:bg-zinc-700
          disabled:opacity-50 disabled:cursor-not-allowed
        "
        disabled={isLoading}
      >
        {/* Icône Google inchangée */}
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Sign in with Google
      </button>
    </div>
  );
};
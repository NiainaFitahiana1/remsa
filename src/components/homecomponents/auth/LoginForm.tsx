'use client';
import { useState, useMemo } from 'react';
import { useLogin } from '@/hooks/useLogin';
import Image from 'next/image';
import logo from '@/../public/logos/logo-text.png';
import { Eye, EyeOff } from 'lucide-react';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export const LoginForm = () => {
  const { login, isLoading, error } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Regex pour validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  // Validation en temps réel
  const emailError = useMemo(() => {
    if (!email) return '';
    return emailRegex.test(email) ? '' : 'Veuillez entrer une adresse email valide';
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) return '';
    return passwordRegex.test(password)
      ? ''
      : 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre';
  }, [password]);

  const isFormValid = email && password && !emailError && !passwordError;

  const handleGoogleLogin = () => {
     window.location.href = `${apiUrl}/auth/google`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    await login({ email, password });
  };

  return (
    <div className="max-w-xl w-full space-y-8 glass-card p-6 sm:p-10 rounded-3xl shadow-2xl border border-white transition-all duration-500">
      {/* Logo */}
      <div className="flex items-center gap-3 -mb-10 -mt-5 -ms-5">
        <Image
          src={logo}
          alt="Atero Logo"
          width={128}
          height={128}
          className="h-32 w-auto transition-transform duration-300 hover:scale-105"
          priority
        />
      </div>

      {/* Message */}
      <div className="relative mb-8">
        <hr className="border-gray-100 w-full" />
        <p className="text-sm text-gray-500 mt-4 ml-1">
          Heureux de vous revoir. Connectez-vous à votre espace.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 ml-1"
            >
              Adresse Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="nom@exemple.com"
              className={`appearance-none rounded-xl block w-full px-4 py-3.5 border placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all sm:text-sm ${
                emailError
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                  : 'border-gray-200 focus:border-red-500'
              }`}
            />
            {emailError && (
              <p className="mt-1 ml-1 text-xs text-red-600 font-medium">{emailError}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1 ml-1">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Mot de passe
              </label>
              <a href="#" className="text-[11px] font-medium text-red-600 hover:text-red-700">
                Oublié ?
              </a>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password ?? ""}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="••••••••"
                className={`appearance-none rounded-xl block w-full px-4 py-3.5 border placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all sm:text-sm pr-12 ${
                  passwordError
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                    : 'border-gray-200 focus:border-red-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {passwordError && (
              <p className="mt-1 ml-1 text-xs text-red-600 font-medium">{passwordError}</p>
            )}
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center px-1">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer">
            Rester connecté
          </label>
        </div>

        {/* Erreur globale du hook */}
        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {/* Bouton Connexion */}
        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/30 transition-all shadow-lg shadow-red-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
              </svg>
              Connexion en cours...
            </div>
          ) : (
            'Se connecter'
          )}
        </button>
      </form>

      {/* Lien inscription */}
      <div className="text-center pt-2">
        <p className="text-sm text-gray-500">
          Pas encore de compte ?{' '}
          <a
            href="/register"
            className="font-semibold text-gray-800 hover:text-red-600 transition-colors border-b border-gray-800 hover:border-red-600 pb-0.5"
          >
            Créer un compte
          </a>
        </p>
      </div>

      {/* Séparateur + Google */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className=" px-4 text-gray-400">ou</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-3 bg-tranparent py-3.5 font-medium text-gray-700 hover:bg-gray-50/25 -mt-5 transition-all active:scale-[0.98] disabled:opacity-70"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Se connecter avec Google
      </button>
    </div>
  );
};
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type LoginCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

type UseLoginReturn = {
  login: (credentials: LoginCredentials) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

export function useLogin(): UseLoginReturn {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async ({ email, password, rememberMe }: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',          
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.message || data.error || 'Échec de connexion – vérifiez vos identifiants'
        );
      }

      router.push('/dashboard');           // ← change selon ton besoin
      router.refresh();                     // force refresh pour middleware / server components

    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue. Réessayez.');
      console.error('[Login error]', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
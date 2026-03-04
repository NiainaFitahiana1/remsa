"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

type LoginCredentials = {
  email: string;
  password: string;
};

type LoginResult = {
  success: boolean;
  error?: string;
};

export function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async ({ email, password }: LoginCredentials): Promise<LoginResult> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",           // indispensable pour les cookies httpOnly
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let message = "Identifiants invalides";

        try {
          const data = await response.json();
          message = data.message || message;
        } catch {
          // silence si pas de JSON
        }

        setError(message);
        return { success: false, error: message };
      }

      // Connexion réussie
      router.push("/dashboard");
      // ou router.replace("/dashboard") si vous voulez éviter le back button

      return { success: true };

    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue lors de la connexion";

      setError(errorMessage);
      return { success: false, error: errorMessage };

    } finally {
      setLoading(false);
    }
  }, [router]);

  return {
    login,
    loading,
    error,
    clearError: () => setError(null),
  };
}
"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { toast } from "@/components/ui/sonner";

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

  const login = useCallback(
    async ({ email, password }: LoginCredentials): Promise<LoginResult> => {
      setLoading(true);
      setError(null);

      try {
        // Login via le proxy Next.js (recommandé en production)
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          let message = "Identifiants invalides";
          try {
            const data = await response.json();
            message = data.message || message;
          } catch {}
          setError(message);
          return { success: false, error: message };
        }

        // Récupération du profil utilisateur via le proxy
        const userRes = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!userRes.ok) {
          throw new Error("Impossible de récupérer les informations utilisateur");
        }

        const user = await userRes.json();

        let redirectPath = "/dashboard";

        switch (user.role) {
          case "ADMIN":
          case "SUPER_ADMIN":
            redirectPath = "/admin";
            break;
          case "DRIVER":
            redirectPath = "/livreur";
            break;
          case "CLIENT":
          default:
            redirectPath = "/dashboard";
        }

        router.push(redirectPath);
        toast.success("Connexion réussie");

        return { success: true };
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors de la connexion";

        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  return {
    login,
    isLoading: loading,
    error,
    clearError: () => setError(null),
  };
}

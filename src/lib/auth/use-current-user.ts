"use client";

import { useEffect, useState } from "react";
import type { User } from "@/types";

type CurrentUserState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

export function useCurrentUser() {
  const [state, setState] = useState<CurrentUserState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",           // très important !
        });

        if (!res.ok) {
          throw new Error("Non authentifié");
        }

        const data = await res.json();
        if (mounted) {
          setState({ user: data, loading: false, error: null });
        }
      } catch (err) {
        if (mounted) {
          setState({
            user: null,
            loading: false,
            error: err instanceof Error ? err.message : "Erreur inconnue",
          });
        }
      }
    }

    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}
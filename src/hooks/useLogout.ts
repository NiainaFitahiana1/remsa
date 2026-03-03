"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function useLogout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include", 
        }
      );

      if (!res.ok) {
        throw new Error("Erreur lors de la déconnexion");
      }

      // Redirige vers login
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
}
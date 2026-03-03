"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // IMPORTANT
          body: JSON.stringify({ email, password }),
        }
      );

      if (!res.ok) throw new Error("Identifiants invalides");

      router.push("/dashboard");
    } catch (err: any) {
      throw new Error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}
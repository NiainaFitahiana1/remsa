import { useState, useEffect } from "react";

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const user = await res.json();
          setRole(user?.role ?? null);
        }
      } catch (err) {
        console.error("Cannot fetch user role", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  return { role, loadingRole: loading };
}
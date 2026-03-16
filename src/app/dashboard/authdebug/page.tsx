"use client";

import { useCurrentUser } from "@/lib/auth/use-current-user";  // ton hook

export default function AuthDebug() {
  const { user, loading, error } = useCurrentUser();

  if (loading) return <div>Chargement auth...</div>;
  if (error)   return <div>Erreur auth : {error}</div>;

  return (
    <div style={{ background: "#ffe", padding: "1rem", border: "2px solid red" }}>
      <h3>Debug Auth (via /api/auth/me)</h3>
      <pre style={{ fontSize: "0.9rem" }}>
        {JSON.stringify(
          {
            connected: !!user,
            userId: user?.id,
            email: user?.email,
            role: user?.role,           // ← LA LIGNE LA PLUS IMPORTANTE
            fullUser: user,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}
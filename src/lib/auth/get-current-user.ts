import { cookies } from "next/headers";
export async function getCurrentUser() {
  const cookieStore = await cookies(); // <-- ajouter await
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const res = await fetch("http://localhost:5000/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}
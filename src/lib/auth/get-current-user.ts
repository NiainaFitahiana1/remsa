import { cookies } from "next/headers";
export async function getCurrentUser() {
  const cookieStore = await cookies(); // <-- ajouter await
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const res = await fetch("https://claudine-synoptistic-nondefectively.ngrok-free.dev/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}
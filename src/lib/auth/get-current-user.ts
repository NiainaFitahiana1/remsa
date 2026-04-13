import { cookies } from "next/headers";

export async function getCurrentUser(): Promise<any | null> {
  const cookieStore = await cookies(); // ✅ ici il faut await
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const res = await fetch(
      `${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL}/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}
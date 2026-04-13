import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Récupère l'URL du backend directement ici (plus fiable)
  const API = process.env.NEXT_PUBLIC_API_URL;

  if (!API) {
    console.error("❌ NEXT_PUBLIC_API_URL n'est pas défini dans .env");
    return NextResponse.json(
      { message: "Configuration serveur manquante" },
      { status: 500 }
    );
  }

  const cookieHeader = request.headers.get("cookie") || "";

  try {
    // 1. Tentative d'appel à /auth/me
    let backendRes = await fetch(`${API}/auth/me`, {
      method: "GET",
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      cache: "no-store",
    });

    // 2. Si access token expiré (401) → on fait le refresh
    if (backendRes.status === 401) {
      console.log("🔄 Access token expiré → Refresh en cours...");

      const refreshRes = await fetch(`${API}/auth/refresh`, {
        method: "POST",
        headers: { 
          Cookie: cookieHeader 
        },
        credentials: "include",
      });

      if (!refreshRes.ok) {
        console.log("❌ Refresh échoué");
        return NextResponse.json(
          { message: "Session expirée, veuillez vous reconnecter" },
          { status: 401 }
        );
      }

      // 3. On refait l'appel à /me avec les nouveaux cookies
      backendRes = await fetch(`${API}/auth/me`, {
        method: "GET",
        headers: { 
          Cookie: cookieHeader 
        },
        credentials: "include",
        cache: "no-store",
      });
    }

    // Si toujours pas OK après refresh
    if (!backendRes.ok) {
      return NextResponse.json(
        { message: "Impossible de récupérer les informations utilisateur" },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy /auth/me error:", error);

    return NextResponse.json(
      { message: "Erreur de connexion au serveur" },
      { status: 500 }
    );
  }
}
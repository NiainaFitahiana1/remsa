import { NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: Request) {
  const cookie = request.headers.get("cookie") || "";

  try {
    // 1️⃣ tentative normale
    let backendRes = await fetch(`${API}/auth/me`, {
      method: "GET",
      headers: { cookie },
      cache: "no-store",
    });

    // 2️⃣ si access token expiré → refresh
    if (backendRes.status === 401) {
      const refreshRes = await fetch(`${API}/auth/refresh`, {
        method: "POST",
        headers: { cookie },
      });

      if (!refreshRes.ok) {
        return NextResponse.json(
          { message: "Session expirée" },
          { status: 401 }
        );
      }

      const setCookie = refreshRes.headers.get("set-cookie");

      backendRes = await fetch(`${API}/auth/me`, {
        method: "GET",
        headers: {
          cookie: setCookie || "",
        },
      });

      const data = await backendRes.json();

      const response = NextResponse.json(data);

      if (setCookie) {
        response.headers.set("set-cookie", setCookie);
      }

      return response;
    }

    // 5️⃣ si OK direct
    const data = await backendRes.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Proxy /auth/me error:", error);

    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
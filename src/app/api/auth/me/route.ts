import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      method: "GET",
      credentials:'include',
      headers: {
        cookie: request.headers.get("cookie") || "",
        'ngrok-skip-browser-warning': 'true',
      },
      cache: "no-store",
    });

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: "Non authentifié" },
        { status: backendRes.status }
      );
    }

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
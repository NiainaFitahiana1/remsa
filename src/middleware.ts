import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  try {
    const cookieHeader = request.headers.get("cookie") || "";

    const res = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
      method: "GET",
      headers: {
        "Cookie": cookieHeader,
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Non authentifié");
    }

    const user = await res.json();

    if (!user?.id) {
      throw new Error("Utilisateur non valide");
    }

    const role = user.role;

    // Vérification des rôles par route
    if (pathname.startsWith("/dashboard/") && role !== "CLIENT") {
      throw new Error("Accès interdit");
    }
    if (pathname.startsWith("/admin/") && !["ADMIN", "SUPER_ADMIN"].includes(role)) {
      throw new Error("Accès interdit");
    }
    if (pathname.startsWith("/livreur/") && role !== "DRIVER") {
      throw new Error("Accès interdit");
    }

    const response = NextResponse.next();
    response.headers.set("x-user-id", user.id);
    response.headers.set("x-user-role", role);

    return response;
  } catch (err) {
    console.error("Middleware auth error:", err);
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/livreur/:path*",
  ],
};
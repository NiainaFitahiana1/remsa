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
  if (request.headers.has("x-middleware-subrequest")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const res = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
      method: "GET",
      headers: {
        cookie: request.headers.get("cookie") || "",
        "x-protect-mw": "1",
      },
      cache: "no-store",
      redirect: "manual",     
    });

    if (!res.ok) {
      throw new Error("Non authentifié");
    }

    const user = await res.json();

    if (!user?.id || user?.role !== "CLIENT") {
      throw new Error("Accès interdit");
    }

    const response = NextResponse.next();
    response.headers.set("x-user-id", user.id);
    response.headers.set("x-user-role", user.role);

    return response;
  } catch (err) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
  ],
};
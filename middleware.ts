import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/manager") && token?.roleId !== 2) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/dashboard") && token?.roleId !== 3) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/member") && (token?.roleId ?? 0) < 1) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/manager/:path*",
    "/member/:path*",
  ],
};
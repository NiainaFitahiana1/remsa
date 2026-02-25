// middleware.ts   (ou src/middleware.ts)
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const protectedPaths = [
  '/dashboard',
  '/profile',
  '/settings',
  // ajoute toutes tes routes protégées (pas besoin de regex ici sauf si complexe)
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. On ne protège que certaines routes
  const isProtectedRoute = protectedPaths.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // 2. Récupère le cookie de session (connect.sid par défaut avec express-session)
  const sessionCookie = request.cookies.get('connect.sid')?.value;

  if (!sessionCookie) {
    // Pas de cookie → redirection login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname); // optionnel : pour rediriger après login
    return NextResponse.redirect(loginUrl);
  }

  try {
    const response = await fetch(`${API_URL}/auth/session`, {
      method: 'GET',
      headers: {
        Cookie: `connect.sid=${sessionCookie}`, // on forward le cookie exact
      },
      credentials: 'include', // important
    });

    if (!response.ok) {
      throw new Error('Session invalide');
    }

    const data = await response.json();

    if (!data.authenticated) {
      throw new Error('Non authentifié');
    }

    const responseWithUser = NextResponse.next();
    responseWithUser.headers.set('x-user', JSON.stringify(data.user || {}));

    return responseWithUser;

  } catch (error) {
    console.error('Middleware auth error:', error);

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
  ],
};
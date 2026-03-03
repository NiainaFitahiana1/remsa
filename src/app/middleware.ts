import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parse } from 'cookie';

const protectedRoutes = ['/profile'];

export function middleware(request: NextRequest) {
  const cookies = parse(request.headers.get('cookie') || '');
  const refreshToken = cookies.refresh_token;

  if (protectedRoutes.includes(request.nextUrl.pathname) && !refreshToken) {
    // No refresh token cookie -> redirect to login
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile'],
};
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');

export const dynamic = 'force-dynamic';     // important pour cookies & auth

export async function GET(req: NextRequest) {
  console.log("=== PROXY GET ACTIVÉ ===");
  console.log("Chemin demandé :", req.nextUrl.pathname);
  console.log("URL complète :", req.nextUrl.toString());
  return proxyHandler(req, 'GET');
}

export async function POST(req: NextRequest) {
  return proxyHandler(req, 'POST');
}

export async function PATCH(req: NextRequest) {
  return proxyHandler(req, 'PATCH');
}

export async function DELETE(req: NextRequest) {
  return proxyHandler(req, 'DELETE');
}
async function proxyHandler(req: NextRequest, method: string) {
  // Log pour debug (garde-les temporairement)
  console.log("PROXY déclenché pour :", req.nextUrl.pathname);

  // IMPORTANT : avec le rewrite source: '/api/:path*' → destination: '/api/proxy/:path*'
  // → pathname = /api/users/profile   (PAS /api/proxy/...)
  // Donc on enlève seulement /api/ au début

  let cleanPath = req.nextUrl.pathname.replace(/^\/api\//, '');  // ← CHANGEMENT CLÉ ici

  const pathSegments = cleanPath
    .split('/')
    .filter(Boolean);

  const targetPath = pathSegments.join('/');
  const targetUrl = `${BACKEND_BASE}/${targetPath}${req.nextUrl.search}`;

  console.log("Chemin nettoyé :", cleanPath);
  console.log("Target path final :", targetPath);
  console.log("URL backend envoyée :", targetUrl);

  // Forward les headers utiles
  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.delete('content-length');
  headers.delete('connection');

  // Très important : forward les cookies (httpOnly inclus)
  const cookieHeader = req.headers.get('cookie');
  if (cookieHeader) {
    headers.set('cookie', cookieHeader);
  }

  // Optionnel : marque la requête comme venant du frontend Next
  // headers.set('x-forwarded-from', 'next-frontend');

  let body: BodyInit | null = null;
  if (method !== 'GET' && method !== 'DELETE') {
    try {
      body = await req.text();   // ou .json() si tu veux parser/valider
    } catch {
      body = null;
    }
  }

  try {
    const backendRes = await fetch(targetUrl, {
      method,
      headers,
      body,
      redirect: 'manual',
      cache: 'no-store',           // ou 'force-cache' selon cas
    });

    // Forward la réponse presque telle quelle
    const response = new NextResponse(backendRes.body, {
      status: backendRes.status,
      statusText: backendRes.statusText,
    });

    // Copie les headers importants (Content-Type, Set-Cookie, etc.)
    backendRes.headers.forEach((value, key) => {
      // Attention : Set-Cookie doit être forwardé correctement
      response.headers.set(key, value);
    });

    return response;
  } catch (err) {
    console.error(`Proxy error ${method} ${targetUrl}:`, err);
    return NextResponse.json(
      { message: 'Proxy backend indisponible' },
      { status: 502 }
    );
  }
}
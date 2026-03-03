import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  try {
    const res = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json(err, { status: res.status });
    }

    const data = await res.json(); // { access_token, user }

    // Récupérer l'objet cookies de façon asynchrone
    const cookieStore = await cookies();

    cookieStore.set('access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    });

    return NextResponse.json({ success: true, user: data.user });
  } catch (err) {
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
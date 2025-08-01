import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Check for session token (NextAuth session)
  const sessionToken =
    request.cookies.get('next-auth.session-token') ||
    request.cookies.get('__Secure-next-auth.session-token');

  // Handle auth page redirects
  const isAuthPage =
    pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');

  if (sessionToken && isAuthPage) {
    // User is logged in, redirect away from auth pages
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/';
    return NextResponse.redirect(new URL(callbackUrl, request.url));
  }

  // Generate session cart ID if it doesn't exist (using crypto.randomUUID)
  let sessionCartId = request.cookies.get('sessionCartId')?.value;
  if (!sessionCartId) {
    // Generate a simple unique ID without external dependencies
    sessionCartId = crypto.randomUUID();
    response.cookies.set('sessionCartId', sessionCartId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};

import { auth } from "@/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Define protected paths that require authentication
  const protectedPaths = [
    /^\/shipping-address/,
    /^\/payment-method/,
    /^\/place-order/,
    /^\/profile/,
    /^\/user\/.*/,
    /^\/order\/.*/,
    /^\/admin/,
  ];

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some((pattern) => pattern.test(pathname));

  // Handle auth page redirects - if user is logged in, redirect away from auth pages
  const isAuthPage = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  
  if (req.auth && isAuthPage) {
    const callbackUrl = req.nextUrl.searchParams.get('callbackUrl') || '/';
    return Response.redirect(new URL(callbackUrl, req.nextUrl.origin));
  }

  // Protect paths that require authentication
  if (isProtectedPath && !req.auth) {
    const signInUrl = new URL('/sign-in', req.nextUrl.origin);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return Response.redirect(signInUrl);
  }
})

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

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/' || path === '/login' || path.startsWith('/_next') || path.startsWith('/api');
  
  // Check if we have the auth cookie
  const authCookie = request.cookies.get('firebase-auth');
  const isAuthenticated = !!authCookie;

  // Redirect authenticated users from login to /translator
  if (isAuthenticated && path === '/login') {
    return NextResponse.redirect(new URL('/translator', request.url));
  }

  // Redirect unauthenticated users to login if they're accessing a protected route
  if (!isAuthenticated && !isPublicPath) {
    // Store the original URL they were trying to access
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', encodeURIComponent(request.url));
    return NextResponse.redirect(redirectUrl);
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 
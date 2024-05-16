import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  console.log('Middleware triggered for:', url.pathname);

  // Simulate authentication check using a query parameter
  const isAuthenticated = url.searchParams.get('authenticated') === 'true';
  console.log('Is authenticated:', isAuthenticated);

  // Prevent redirection loop by not redirecting when on the login page
  if (url.pathname === '/login') {
    console.log('Already on login page');
    return NextResponse.next();
  }

  // Redirect to /login if not authenticated and trying to access the home page
  if (!isAuthenticated && url.pathname === '/') {
    url.pathname = '/login';
    console.log('Redirecting to /login');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/index', '/login'],
};

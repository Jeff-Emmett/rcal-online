import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to handle subdomain-based space routing.
 *
 * Routes:
 * - rcal.online -> home/landing page
 * - www.rcal.online -> home/landing page
 * - <space>.rcal.online -> rewrite to /s/<space>
 *
 * Also handles localhost for development.
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  let subdomain: string | null = null;

  // Match production: <space>.rcal.online
  const match = hostname.match(/^([a-z0-9][a-z0-9-]*[a-z0-9]|[a-z0-9])\.\w+\.online/);
  if (match && match[1] !== 'www') {
    subdomain = match[1];
  } else if (hostname.includes('localhost')) {
    // Development: <space>.localhost:port
    const parts = hostname.split('.localhost')[0].split('.');
    if (parts.length > 0 && parts[0] !== 'localhost') {
      subdomain = parts[parts.length - 1];
    }
  }

  // If we have a subdomain, rewrite root path to space page
  if (subdomain && subdomain.length > 0 && url.pathname === '/') {
    url.pathname = `/s/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};

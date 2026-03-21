import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to handle subdomain-based routing.
 *
 * Routes:
 * - rspace.online/rcal/* -> primary (basePath handles this)
 * - rcal.online -> redirected by rspace-redirects to rspace.online/rcal
 * - demo.rcal.online -> calendar demo (/demo)
 * - <space>.rcal.online -> rewrite to /s/<space>
 * - <space>.rspace.online/rcal/* -> rewrite to /s/<space>
 *
 * Also handles localhost for development.
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  let subdomain: string | null = null;

  // Match subdomain from rcal.online: <sub>.rcal.online
  const rcalMatch = hostname.match(/^([a-z0-9][a-z0-9-]*[a-z0-9]|[a-z0-9])\.rcal\.online/);
  if (rcalMatch && rcalMatch[1] !== 'www') {
    subdomain = rcalMatch[1];
  }

  // Match subdomain from rspace.online: <sub>.rspace.online
  if (!subdomain) {
    const rspaceMatch = hostname.match(/^([a-z0-9][a-z0-9-]*[a-z0-9]|[a-z0-9])\.rspace\.online/);
    if (rspaceMatch && rspaceMatch[1] !== 'www' && rspaceMatch[1] !== 'registry') {
      subdomain = rspaceMatch[1];
    }
  }

  // Development: <sub>.localhost:port
  if (!subdomain && hostname.includes('localhost')) {
    const parts = hostname.split('.localhost')[0].split('.');
    if (parts.length > 0 && parts[0] !== 'localhost') {
      subdomain = parts[parts.length - 1];
    }
  }

  if (subdomain && subdomain.length > 0) {
    // demo subdomain → serve the calendar demo
    if (subdomain === 'demo') {
      if (url.pathname === '/') {
        url.pathname = '/demo';
        return NextResponse.rewrite(url);
      }
      return NextResponse.next();
    }

    // Other subdomains → space pages
    if (url.pathname === '/') {
      url.pathname = `/s/${subdomain}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};

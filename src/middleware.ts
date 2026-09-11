import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { checkRateLimit } from '@/lib/security/rate-limit';

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'gmdware-default-super-secret-key-32-chars-minimum'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  // 1. Origin-based CSRF Protection for mutating API requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method) && pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'CSRF_BLOCKED',
                message: 'Cross-site request forgery protection triggered.',
              },
            },
            { status: 403 }
          );
        }
      } catch {
        // Malformed origin
      }
    }
  }

  let apiRateLimit: { allowed: boolean; remaining: number; resetTime: number } | null = null;

  // 2. Global Rate Limiting for API routes
  if (pathname.startsWith('/api/')) {
    apiRateLimit = checkRateLimit(`api_global:${clientIp}`, 120, 60000);
    if (!apiRateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests. Please slow down and try again.',
          },
        },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': '120',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(apiRateLimit.resetTime / 1000)),
          },
        }
      );
    }
  }

  const requestHeaders = new Headers(request.headers);
  const themeQuery = request.nextUrl.searchParams.get('themePreview') || request.nextUrl.searchParams.get('theme');
  if (themeQuery) {
    requestHeaders.set('x-theme-preview', themeQuery);
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (apiRateLimit) {
    response.headers.set('X-RateLimit-Limit', '120');
    response.headers.set('X-RateLimit-Remaining', String(apiRateLimit.remaining));
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(apiRateLimit.resetTime / 1000)));
  }

  // 3. Attach Defense-in-Depth Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), browsing-topics=()'
  );
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }

  // 4. Admin Route Protection
  const isAdminPath = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
  const isAdminApi = pathname.startsWith('/api/admin');

  if (isAdminPath || isAdminApi) {
    const sessionCookie = request.cookies.get('gmdware_admin_session')?.value;

    if (!sessionCookie) {
      if (isAdminApi) {
        return NextResponse.json(
          { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
          { status: 401 }
        );
      }
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(sessionCookie, JWT_SECRET);
    } catch {
      // Invalid or expired token
      if (isAdminApi) {
        return NextResponse.json(
          { success: false, error: { code: 'UNAUTHORIZED', message: 'Session expired or invalid' } },
          { status: 401 }
        );
      }
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - uploads folder
     */
    '/((?!_next/static|_next/image|favicon.ico|uploads).*)',
  ],
};

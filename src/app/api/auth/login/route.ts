import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validations/auth';
import { attachAdminSessionCookie } from '@/lib/auth/session';
import { AuthService } from '@/services/auth.service';
import { checkRateLimit, resetRateLimit } from '@/lib/security/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const isDev = process.env.NODE_ENV !== 'production';
    const rateLimit = checkRateLimit(`login:${clientIp}`, isDev ? 100 : 10, 15 * 60 * 1000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: { code: 'TOO_MANY_ATTEMPTS', message: 'Too many login attempts. Please try again later.' } },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid credentials format' } },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const authResult = await AuthService.login(email, password);

    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } },
        { status: 401 }
      );
    }

    // Reset rate limit on successful authentication
    resetRateLimit(`login:${clientIp}`);

    const response = NextResponse.json({
      success: true,
      data: { user: authResult.user },
    });

    return await attachAdminSessionCookie(response, {
      userId: authResult.user.id,
      email: authResult.user.email,
      name: authResult.user.name,
      roles: authResult.user.roles,
    });
  } catch (err: any) {
    console.error('[API /api/auth/login] Unexpected error:', err);
    const isProd = process.env.NODE_ENV === 'production';
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: isProd
            ? 'An unexpected error occurred during authentication.'
            : err?.message || 'Authentication failed',
        },
      },
      { status: 500 }
    );
  }
}


import { NextRequest } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { loginSchema } from '@/lib/validations/auth';
import { attachAdminSessionCookie } from '@/lib/auth/session';
import { successResponse, errorResponse } from '@/lib/api/response';
import { checkRateLimit } from '@/lib/security/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = checkRateLimit(`v1_login:${clientIp}`, 10, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return errorResponse('TOO_MANY_REQUESTS', 'Too many login attempts. Please wait 15 minutes.', 429);
    }

    const body = await req.json();
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid credentials format', 400, result.error.flatten());
    }

    const authResult = await AuthService.login(result.data.email, result.data.password);
    if (!authResult.success || !authResult.user) {
      return errorResponse('INVALID_CREDENTIALS', authResult.message || 'Invalid email or password', 401);
    }

    const res = successResponse({
      user: authResult.user,
      token: authResult.token,
    });

    return await attachAdminSessionCookie(res, {
      userId: authResult.user.id,
      email: authResult.user.email,
      name: authResult.user.name,
      roles: authResult.user.roles,
    });
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Internal authentication error', 500);
  }
}

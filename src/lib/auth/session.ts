import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { signAdminToken, verifyAdminToken, AdminTokenPayload } from './jwt';

export const ADMIN_SESSION_COOKIE_NAME = 'gmdware_admin_session';

/**
 * Retrieves the current admin session from incoming cookies
 */
export async function getAdminSession(): Promise<AdminTokenPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}

/**
 * Attaches the admin session JWT as an HttpOnly secure cookie to a NextResponse
 */
export async function attachAdminSessionCookie(
  response: NextResponse,
  payload: AdminTokenPayload
): Promise<NextResponse> {
  const token = await signAdminToken(payload, '7d');
  
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}

/**
 * Clears the admin session cookie from a NextResponse
 */
export function clearAdminSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });

  return response;
}

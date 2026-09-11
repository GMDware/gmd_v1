import { clearAdminSessionCookie } from '@/lib/auth/session';
import { successResponse } from '@/lib/api/response';

export async function POST() {
  const res = successResponse({ message: 'Session successfully terminated' });
  return clearAdminSessionCookie(res);
}

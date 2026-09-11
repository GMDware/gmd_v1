import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/api/guard';
import { AuthService } from '@/services/auth.service';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.authorized || !auth.session) {
    return auth.response!;
  }

  const user = await AuthService.getCurrentUser(auth.session.userId);
  if (!user) {
    return errorResponse('NOT_FOUND', 'User profile not found', 404);
  }

  return successResponse({ user });
}

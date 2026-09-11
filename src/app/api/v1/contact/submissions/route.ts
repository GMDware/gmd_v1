import { NextRequest } from 'next/server';
import { ContactService } from '@/services/contact.service';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { ContactStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const auth = await requirePermission('contact.read', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status') as ContactStatus | null;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const result = await ContactService.list({
      status: status || undefined,
      page,
      limit,
    });

    return successResponse(result.items, 200, result.pagination);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve contact submissions', 500);
  }
}

import { NextRequest } from 'next/server';
import { MediaService } from '@/services/media.service';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requirePermission('media.delete', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const { id } = await params;
    const deleted = await MediaService.delete(id, auth.session.userId);
    return successResponse({ id: deleted.id, message: 'Media asset deleted successfully' });
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to delete media asset', 500);
  }
}

import { NextRequest } from 'next/server';
import { ProjectService } from '@/services/project.service';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requirePermission('projects.update', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const { id } = await params;
    const body = await req.json();
    const isFeatured = Boolean(body.isFeatured);

    const updated = await ProjectService.setFeatured(id, isFeatured, auth.session.userId);
    return successResponse({ id: updated.id, isFeatured: updated.isFeatured });
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to update featured status', 500);
  }
}

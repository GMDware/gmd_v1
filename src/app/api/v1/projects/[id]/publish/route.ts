import { NextRequest } from 'next/server';
import { ProjectService } from '@/services/project.service';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { PublicationStatus } from '@prisma/client';

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
    const status = body.status as PublicationStatus;

    if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      return errorResponse('VALIDATION_ERROR', 'Invalid status. Must be DRAFT, PUBLISHED, or ARCHIVED', 400);
    }

    const updated = await ProjectService.setStatus(id, status, auth.session.userId);
    return successResponse({ id: updated.id, status: updated.status });
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to update publication status', 500);
  }
}

import { NextRequest } from 'next/server';
import { ProjectService } from '@/services/project.service';
import { requirePermission } from '@/lib/api/guard';
import { projectSchema } from '@/lib/validations/project';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await ProjectService.getById(id);
    if (!project) {
      return errorResponse('NOT_FOUND', `Project with ID "${id}" was not found`, 404);
    }
    return successResponse(project);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve project', 500);
  }
}

export async function PUT(
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
    const parsed = projectSchema.partial().safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid update payload', 400, parsed.error.flatten());
    }

    const updated = await ProjectService.update(id, {
      ...parsed.data,
      userId: auth.session.userId,
    });

    return successResponse(updated);
  } catch (err: any) {
    if (err.message.includes('not found')) {
      return errorResponse('NOT_FOUND', err.message, 404);
    }
    if (err.message.includes('already exists')) {
      return errorResponse('DUPLICATE_SLUG', err.message, 409);
    }
    return errorResponse('SERVER_ERROR', err.message || 'Failed to update project', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requirePermission('projects.delete', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const { id } = await params;
    const deleted = await ProjectService.softDelete(id, auth.session.userId);
    return successResponse({ id: deleted.id, status: 'ARCHIVED', message: 'Project archived successfully' });
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to delete project', 500);
  }
}

import { NextRequest } from 'next/server';
import { TeamService } from '@/services/team.service';
import { requirePermission } from '@/lib/api/guard';
import { teamMemberSchema } from '@/lib/validations/team';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const member = await TeamService.getById(id);
    if (!member) {
      return errorResponse('NOT_FOUND', `Team member with ID "${id}" was not found`, 404);
    }
    return successResponse(member);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve member', 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requirePermission('team.update', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = teamMemberSchema.partial().safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid update payload', 400, parsed.error.flatten());
    }

    const updated = await TeamService.update(id, {
      ...parsed.data,
      userId: auth.session.userId,
    });

    return successResponse(updated);
  } catch (err: any) {
    if (err.message.includes('not found')) {
      return errorResponse('NOT_FOUND', err.message, 404);
    }
    return errorResponse('SERVER_ERROR', err.message || 'Failed to update member', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requirePermission('team.delete', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const { id } = await params;
    const deleted = await TeamService.softDelete(id, auth.session.userId);
    return successResponse({ id: deleted.id, message: 'Team member archived successfully' });
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to delete member', 500);
  }
}

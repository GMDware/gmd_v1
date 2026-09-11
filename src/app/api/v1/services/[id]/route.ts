import { NextRequest } from 'next/server';
import { ServicesService } from '@/services/service.service';
import { requirePermission } from '@/lib/api/guard';
import { serviceSchema } from '@/lib/validations/service';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await ServicesService.getById(id);
    if (!service) {
      return errorResponse('NOT_FOUND', `Service with ID "${id}" was not found`, 404);
    }
    return successResponse(service);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve service', 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requirePermission('services.update', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = serviceSchema.partial().safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid update payload', 400, parsed.error.flatten());
    }

    const updated = await ServicesService.update(id, {
      ...parsed.data,
      userId: auth.session.userId,
    });

    return successResponse(updated);
  } catch (err: any) {
    if (err.message.includes('not found')) {
      return errorResponse('NOT_FOUND', err.message, 404);
    }
    return errorResponse('SERVER_ERROR', err.message || 'Failed to update service', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requirePermission('services.delete', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const { id } = await params;
    const deleted = await ServicesService.softDelete(id, auth.session.userId);
    return successResponse({ id: deleted.id, message: 'Service archived successfully' });
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to delete service', 500);
  }
}

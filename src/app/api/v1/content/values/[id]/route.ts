import { NextRequest } from 'next/server';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { ContentService } from '@/services/content.service';
import { z } from 'zod';

const updateValueSchema = z.object({
  title: z.string().min(1).optional(),
  summary: z.string().min(1).optional(),
  displayOrder: z.number().int().optional(),
  iconName: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission('settings.update', request);
  if (!auth.authorized || !auth.session) {
    return auth.response!;
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = updateValueSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid company value data', 400, parsed.error.format());
    }

    const updated = await ContentService.updateValue(id, parsed.data);
    return successResponse(updated);
  } catch (err: any) {
    return errorResponse('INTERNAL_ERROR', err.message || 'Failed to update company value', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission('settings.update', request);
  if (!auth.authorized || !auth.session) {
    return auth.response!;
  }

  const { id } = await params;

  try {
    await ContentService.deleteValue(id);
    return successResponse({ deleted: true, id });
  } catch (err: any) {
    return errorResponse('INTERNAL_ERROR', err.message || 'Failed to delete company value', 500);
  }
}

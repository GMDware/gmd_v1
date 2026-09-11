import { NextRequest } from 'next/server';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { ContentService } from '@/services/content.service';
import { z } from 'zod';

const updateProcessStepSchema = z.object({
  stepNumber: z.number().int().optional(),
  title: z.string().min(1).optional(),
  phase: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  deliverables: z.array(z.string()).optional(),
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
    const parsed = updateProcessStepSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid process step data', 400, parsed.error.format());
    }

    const updated = await ContentService.updateProcessStep(id, parsed.data);
    return successResponse(updated);
  } catch (err: any) {
    return errorResponse('INTERNAL_ERROR', err.message || 'Failed to update process step', 500);
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
    await ContentService.deleteProcessStep(id);
    return successResponse({ deleted: true, id });
  } catch (err: any) {
    return errorResponse('INTERNAL_ERROR', err.message || 'Failed to delete process step', 500);
  }
}

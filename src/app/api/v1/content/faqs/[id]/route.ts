import { NextRequest } from 'next/server';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { ContentService } from '@/services/content.service';
import { z } from 'zod';

const updateFAQSchema = z.object({
  question: z.string().min(1).optional(),
  answer: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  displayOrder: z.number().int().optional(),
  isPublished: z.boolean().optional(),
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
    const parsed = updateFAQSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid FAQ data', 400, parsed.error.format());
    }

    const updated = await ContentService.updateFAQ(id, parsed.data);
    return successResponse(updated);
  } catch (err: any) {
    return errorResponse('INTERNAL_ERROR', err.message || 'Failed to update FAQ', 500);
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
    await ContentService.deleteFAQ(id);
    return successResponse({ deleted: true, id });
  } catch (err: any) {
    return errorResponse('INTERNAL_ERROR', err.message || 'Failed to delete FAQ', 500);
  }
}

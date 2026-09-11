import { NextRequest } from 'next/server';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { ContentService } from '@/services/content.service';
import { z } from 'zod';

const updateNavSchema = z.object({
  label: z.string().min(1).optional(),
  path: z.string().min(1).optional(),
  location: z.enum(['header', 'footer', 'sidebar']).optional(),
  displayOrder: z.number().int().optional(),
  isExternal: z.boolean().optional(),
  isEnabled: z.boolean().optional(),
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
    const parsed = updateNavSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid navigation data', 400, parsed.error.format());
    }

    // Sanitize path against unsafe protocols
    if (parsed.data.path && /^(javascript|data|vbscript):/i.test(parsed.data.path)) {
      return errorResponse('BAD_REQUEST', 'Unsafe URL protocol detected', 400);
    }

    const updated = await ContentService.updateNavigationItem(id, parsed.data);
    return successResponse(updated);
  } catch (err: any) {
    return errorResponse('INTERNAL_ERROR', err.message || 'Failed to update navigation item', 500);
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
    await ContentService.deleteNavigationItem(id);
    return successResponse({ deleted: true, id });
  } catch (err: any) {
    return errorResponse('INTERNAL_ERROR', err.message || 'Failed to delete navigation item', 500);
  }
}

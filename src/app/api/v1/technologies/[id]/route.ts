import { NextRequest } from 'next/server';
import { TechnologyService } from '@/services/technology.service';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { z } from 'zod';

const updateTechSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  slug: z.string().min(2).max(100).optional(),
  category: z.string().min(2).max(50).optional(),
  logoUrl: z.string().optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  url: z.string().url().optional().nullable().or(z.literal('')),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tech = await TechnologyService.getById(id);
    if (!tech) {
      return errorResponse('NOT_FOUND', `Technology with ID "${id}" was not found`, 404);
    }
    return successResponse(tech);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve technology', 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requirePermission('technologies.update', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = updateTechSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid update payload', 400, parsed.error.flatten());
    }

    const updated = await TechnologyService.update(id, {
      ...parsed.data,
      url: parsed.data.url || undefined,
      userId: auth.session.userId,
    });

    return successResponse(updated);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to update technology', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requirePermission('technologies.delete', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const { id } = await params;
    const deleted = await TechnologyService.delete(id, auth.session.userId);
    return successResponse({ id: deleted.id, message: 'Technology deleted successfully' });
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to delete technology', 500);
  }
}

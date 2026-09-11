import { NextRequest } from 'next/server';
import { ProjectService } from '@/services/project.service';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { z } from 'zod';

const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      displayOrder: z.number().int(),
    })
  ).min(1),
});

export async function PUT(req: NextRequest) {
  try {
    const auth = await requirePermission('projects.update', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const body = await req.json();
    const parsed = reorderSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid reorder array', 400, parsed.error.flatten());
    }

    const result = await ProjectService.reorder(parsed.data.items, auth.session.userId);
    return successResponse({ count: result.length, message: 'Projects successfully reordered' });
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to reorder projects', 500);
  }
}

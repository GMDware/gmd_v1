import { NextRequest } from 'next/server';
import { ContentService } from '@/services/content.service';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { z } from 'zod';

const navItemSchema = z.object({
  label: z.string().min(1).max(50),
  path: z
    .string()
    .min(1)
    .max(200)
    .refine(
      (val) => !/^(javascript|data|vbscript):/i.test(val.trim()),
      { message: 'Unsafe URI scheme detected in navigation path.' }
    ),
  location: z.string().default('header'),
  displayOrder: z.number().int().default(0),
  isExternal: z.boolean().default(false),
  parentId: z.string().uuid().optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const location = searchParams.get('location') || 'header';
    const items = await ContentService.listNavigation(location);
    return successResponse(items);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve navigation', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission('settings.update', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const body = await req.json();
    const parsed = navItemSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid navigation payload', 400, parsed.error.flatten());
    }

    const item = await ContentService.createNavigationItem({
      ...parsed.data,
      parentId: parsed.data.parentId || undefined,
    });

    return successResponse(item, 201);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to create navigation item', 500);
  }
}

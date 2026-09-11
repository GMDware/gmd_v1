import { NextRequest } from 'next/server';
import { ContentService } from '@/services/content.service';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { z } from 'zod';

const valueSchema = z.object({
  title: z.string().min(2).max(100),
  summary: z.string().min(10).max(500),
  displayOrder: z.number().int().default(0),
  iconName: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const values = await ContentService.listValues();
    return successResponse(values);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve values', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission('content.update', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const body = await req.json();
    const parsed = valueSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid value payload', 400, parsed.error.flatten());
    }

    const val = await ContentService.createValue({
      ...parsed.data,
      iconName: parsed.data.iconName || undefined,
    });

    return successResponse(val, 201);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to create value', 500);
  }
}

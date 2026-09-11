import { NextRequest } from 'next/server';
import { ContentService } from '@/services/content.service';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { z } from 'zod';
import { PublicationStatus } from '@prisma/client';

const insightSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200),
  summary: z.string().min(10).max(1000),
  content: z.string().min(20),
  categoryId: z.string().uuid(),
  coverImageId: z.string().uuid().optional().nullable(),
  readTimeMin: z.number().int().default(5),
  tags: z.array(z.string()).default([]),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  isFeatured: z.boolean().default(false),
  publishedAt: z.string().datetime().optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status') as PublicationStatus | null;
    const categoryId = searchParams.get('categoryId') || undefined;

    const insights = await ContentService.listInsights({
      status: status || undefined,
      categoryId,
    });

    return successResponse(insights);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve insights', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission('content.update', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const body = await req.json();
    const parsed = insightSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid insight payload', 400, parsed.error.flatten());
    }

    const insight = await ContentService.createInsight({
      ...parsed.data,
      authorId: auth.session.userId,
      publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : undefined,
    });

    return successResponse(insight, 201);
  } catch (err: any) {
    if (err.message.includes('already exists')) {
      return errorResponse('DUPLICATE_SLUG', err.message, 409);
    }
    return errorResponse('SERVER_ERROR', err.message || 'Failed to create insight', 500);
  }
}

import { NextRequest } from 'next/server';
import { TechnologyService } from '@/services/technology.service';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { z } from 'zod';

const technologySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100),
  category: z.string().min(2).max(50),
  logoUrl: z.string().optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  url: z.string().url().optional().nullable().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get('category') || undefined;
    const isFeatured = searchParams.has('featured') ? searchParams.get('featured') === 'true' : undefined;
    const isActive = searchParams.has('active') ? searchParams.get('active') === 'true' : undefined;

    const items = await TechnologyService.list({ category, isFeatured, isActive });
    return successResponse(items);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve technologies', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission('technologies.create', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const body = await req.json();
    const parsed = technologySchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid technology payload', 400, parsed.error.flatten());
    }

    const tech = await TechnologyService.create({
      ...parsed.data,
      url: parsed.data.url || undefined,
      userId: auth.session.userId,
    });

    return successResponse(tech, 201);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to create technology', 500);
  }
}

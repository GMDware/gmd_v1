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
    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
      return errorResponse('VALIDATION_ERROR', 'Technology name is required', 400);
    }

    const tech = await TechnologyService.findOrCreate({
      name: body.name.trim(),
      slug: body.slug?.trim(),
      category: body.category?.trim(),
      userId: auth.session.userId,
    });

    return successResponse(tech, 201);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to create technology', 500);
  }
}

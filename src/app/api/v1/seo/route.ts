import { NextRequest } from 'next/server';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { ContentService } from '@/services/content.service';
import { z } from 'zod';

const upsertSEOSchema = z.object({
  routePath: z.string().optional(),
  route: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  keywords: z.array(z.string()).optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImageUrl: z.string().optional(),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
  noIndex: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const route = searchParams.get('routePath') || searchParams.get('route');

    if (route) {
      const setting = await ContentService.getSEOSetting(route);
      return successResponse(setting);
    }

    const settings = await ContentService.listSEOSettings();
    return successResponse(settings);
  } catch (err: any) {
    return errorResponse('INTERNAL_ERROR', err.message || 'Failed to retrieve SEO settings', 500);
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requirePermission('settings.update', request);
  if (!auth.authorized || !auth.session) {
    return auth.response!;
  }

  try {
    const body = await request.json();
    const parsed = upsertSEOSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid SEO configuration data', 400, parsed.error.format());
    }

    const routePath = parsed.data.routePath || parsed.data.route || '/';
    const ogImageUrl = parsed.data.ogImageUrl || parsed.data.ogImage;

    const updated = await ContentService.upsertSEOSetting({
      ...parsed.data,
      routePath,
      ogImageUrl,
      userId: auth.session.userId,
    });

    return successResponse(updated);
  } catch (err: any) {
    return errorResponse('INTERNAL_ERROR', err.message || 'Failed to save SEO settings', 500);
  }
}

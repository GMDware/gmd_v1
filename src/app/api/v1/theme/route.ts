import { NextRequest } from 'next/server';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { ContentService } from '@/services/content.service';
import DataStore from '@/lib/db/data-store';
import { THEME_LIST, isValidTheme, sanitizeThemeId, DEFAULT_THEME_ID } from '@/lib/theme/registry';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const activateThemeSchema = z.object({
  themeId: z.string().refine(isValidTheme, { message: 'Invalid theme ID specified' }),
});

export async function GET() {
  try {
    const settings = await DataStore.getSettings();
    const activeTheme = sanitizeThemeId(settings?.active_theme || DEFAULT_THEME_ID);

    return successResponse({
      activeTheme,
      themes: THEME_LIST,
    });
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve theme state', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission('settings.update', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const body = await req.json();
    const parsed = activateThemeSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid theme specified', 400, parsed.error.flatten());
    }

    const { themeId } = parsed.data;

    // Persist to PostgreSQL SiteSetting via ContentService with audit log
    await ContentService.updateSetting(
      'active_theme',
      themeId,
      'branding',
      auth.session.userId
    );

    // Revalidate public cache paths
    try {
      revalidatePath('/', 'layout');
    } catch {
      // Ignore in development
    }

    return successResponse({
      activeTheme: themeId,
      message: `Successfully activated ${themeId.toUpperCase()} as public website identity.`,
    });
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to activate theme', 500);
  }
}

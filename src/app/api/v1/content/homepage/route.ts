import { NextRequest } from 'next/server';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { ContentService } from '@/services/content.service';
import { z } from 'zod';

const homepageSettingsSchema = z.object({
  homepage_hero_badge: z.string().optional(),
  homepage_hero_headline: z.string().optional(),
  homepage_hero_subtitle: z.string().optional(),
  homepage_primary_cta_label: z.string().optional(),
  homepage_primary_cta_url: z.string().optional(),
  homepage_secondary_cta_label: z.string().optional(),
  homepage_secondary_cta_url: z.string().optional(),
  homepage_final_cta_headline: z.string().optional(),
  homepage_final_cta_subtitle: z.string().optional(),
  homepage_final_cta_button_label: z.string().optional(),
  homepage_final_cta_button_url: z.string().optional(),
  homepage_section_services_enabled: z.string().optional(),
  homepage_section_projects_enabled: z.string().optional(),
  homepage_section_process_enabled: z.string().optional(),
  homepage_section_values_enabled: z.string().optional(),
  homepage_section_technologies_enabled: z.string().optional(),
  homepage_section_faqs_enabled: z.string().optional(),
});

export async function GET() {
  try {
    const allSettings = await ContentService.getSettings();
    const homepageKeys = [
      'homepage_hero_badge',
      'homepage_hero_headline',
      'homepage_hero_subtitle',
      'homepage_primary_cta_label',
      'homepage_primary_cta_url',
      'homepage_secondary_cta_label',
      'homepage_secondary_cta_url',
      'homepage_final_cta_headline',
      'homepage_final_cta_subtitle',
      'homepage_final_cta_button_label',
      'homepage_final_cta_button_url',
      'homepage_section_services_enabled',
      'homepage_section_projects_enabled',
      'homepage_section_process_enabled',
      'homepage_section_values_enabled',
      'homepage_section_technologies_enabled',
      'homepage_section_faqs_enabled',
    ];

    const result: Record<string, string> = {};
    for (const key of homepageKeys) {
      if (allSettings[key] !== undefined) {
        result[key] = allSettings[key];
      }
    }

    return successResponse(result);
  } catch (err: any) {
    return errorResponse('INTERNAL_ERROR', err.message || 'Failed to retrieve homepage settings', 500);
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requirePermission('settings.update', request);
  if (!auth.authorized || !auth.session) {
    return auth.response!;
  }

  try {
    const body = await request.json();
    const parsed = homepageSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid homepage settings', 400, parsed.error.format());
    }

    const cleanSettings: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed.data)) {
      if (v !== undefined) {
        cleanSettings[k] = String(v);
      }
    }

    await ContentService.batchUpdateSettings(cleanSettings, 'homepage', auth.session.userId);
    return successResponse(cleanSettings);
  } catch (err: any) {
    return errorResponse('INTERNAL_ERROR', err.message || 'Failed to save homepage settings', 500);
  }
}

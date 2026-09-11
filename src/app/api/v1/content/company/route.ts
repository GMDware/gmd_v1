import { NextRequest } from 'next/server';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { ContentService } from '@/services/content.service';
import { z } from 'zod';

const companySettingsSchema = z.object({
  brand_name: z.string().optional(),
  legal_entity_name: z.string().optional(),
  tagline: z.string().optional(),
  company_description: z.string().optional(),
  mission_statement: z.string().optional(),
  vision_statement: z.string().optional(),
  why_gmdware_summary: z.string().optional(),
  contact_email: z.string().optional(),
  headquarters_location: z.string().optional(),
});

export async function GET() {
  try {
    const allSettings = await ContentService.getSettings();
    const companyKeys = [
      'brand_name',
      'legal_entity_name',
      'tagline',
      'company_description',
      'mission_statement',
      'vision_statement',
      'why_gmdware_summary',
      'contact_email',
      'headquarters_location',
    ];

    const result: Record<string, string> = {};
    for (const key of companyKeys) {
      if (allSettings[key] !== undefined) {
        result[key] = allSettings[key];
      }
    }

    return successResponse(result);
  } catch (err: any) {
    return errorResponse('INTERNAL_ERROR', err.message || 'Failed to retrieve company settings', 500);
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requirePermission('settings.update', request);
  if (!auth.authorized || !auth.session) {
    return auth.response!;
  }

  try {
    const body = await request.json();
    const parsed = companySettingsSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid company settings', 400, parsed.error.format());
    }

    const cleanSettings: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed.data)) {
      if (v !== undefined) {
        cleanSettings[k] = String(v);
      }
    }

    await ContentService.batchUpdateSettings(cleanSettings, 'branding', auth.session.userId);
    return successResponse(cleanSettings);
  } catch (err: any) {
    return errorResponse('INTERNAL_ERROR', err.message || 'Failed to save company settings', 500);
  }
}

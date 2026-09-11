import { NextRequest } from 'next/server';
import { ContentService } from '@/services/content.service';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { z } from 'zod';

const updateSettingSchema = z.object({
  key: z.string().min(2).max(100),
  value: z.string(),
  group: z.string().default('general'),
});

export async function GET() {
  try {
    const settings = await ContentService.getSettings();
    return successResponse(settings);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve settings', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission('settings.update', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const body = await req.json();
    const parsed = updateSettingSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid setting payload', 400, parsed.error.flatten());
    }

    const updated = await ContentService.updateSetting(
      parsed.data.key,
      parsed.data.value,
      parsed.data.group,
      auth.session.userId
    );

    return successResponse(updated);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to update setting', 500);
  }
}

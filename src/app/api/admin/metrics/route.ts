import { NextRequest } from 'next/server';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { MetricsService } from '@/services/metrics.service';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const metricItemSchema = z.object({
  id: z.string().min(1),
  key: z.enum(['projects', 'clients', 'inquiries', 'uptime', 'visitors']),
  mode: z.enum(['manual', 'auto']),
  manualValue: z.string().min(1),
  autoQueryKey: z.string().optional(),
  label: z.string().min(1),
  subtext: z.string().min(1),
  order: z.number().int(),
  isVisible: z.boolean(),
});

const putMetricsSchema = z.object({
  metrics: z.array(metricItemSchema).min(1),
});

export async function GET(request: NextRequest) {
  const auth = await requirePermission('settings.read', request);
  if (!auth.authorized || !auth.session) {
    return auth.response!;
  }

  try {
    const [items, autoValues] = await Promise.all([
      MetricsService.getMetricConfigurations(),
      MetricsService.getAllAutoValues(),
    ]);

    return successResponse({ items, autoValues });
  } catch (err: any) {
    return errorResponse(
      'INTERNAL_ERROR',
      err?.message || 'Failed to retrieve admin metric configurations',
      500
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requirePermission('settings.update', request);
  if (!auth.authorized || !auth.session) {
    return auth.response!;
  }

  try {
    const body = await request.json();
    const parsed = putMetricsSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(
        'VALIDATION_ERROR',
        'Invalid metric items payload',
        400,
        parsed.error.format()
      );
    }

    const saved = await MetricsService.saveMetricConfigurations(
      parsed.data.metrics,
      auth.session.userId
    );

    return successResponse(saved);
  } catch (err: any) {
    return errorResponse(
      'INTERNAL_ERROR',
      err?.message || 'Failed to save metric configurations',
      500
    );
  }
}

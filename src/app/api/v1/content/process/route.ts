import { NextRequest } from 'next/server';
import { ContentService } from '@/services/content.service';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { z } from 'zod';

const processStepSchema = z.object({
  stepNumber: z.number().int().min(1),
  title: z.string().min(2).max(150),
  phase: z.string().min(2).max(50),
  description: z.string().min(10),
  deliverables: z.array(z.string()).default([]),
  iconName: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const steps = await ContentService.listProcessSteps();
    return successResponse(steps);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve process steps', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission('content.update', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const body = await req.json();
    const parsed = processStepSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid process step payload', 400, parsed.error.flatten());
    }

    const step = await ContentService.upsertProcessStep({
      ...parsed.data,
      iconName: parsed.data.iconName || undefined,
    });

    return successResponse(step, 201);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to save process step', 500);
  }
}

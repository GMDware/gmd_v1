import { NextRequest } from 'next/server';
import { TeamService } from '@/services/team.service';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { z } from 'zod';

const roleSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().max(300).optional(),
});

export async function GET() {
  try {
    const roles = await TeamService.listRoles();
    return successResponse(roles);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve roles', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission('team.create', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const body = await req.json();
    const parsed = roleSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid role payload', 400, parsed.error.flatten());
    }

    const role = await TeamService.createRole(parsed.data);
    return successResponse(role, 201);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to create role', 500);
  }
}

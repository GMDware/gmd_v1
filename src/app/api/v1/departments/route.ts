import { NextRequest } from 'next/server';
import { TeamService } from '@/services/team.service';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { z } from 'zod';

const departmentSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100),
  order: z.number().int().default(0),
});

export async function GET() {
  try {
    const departments = await TeamService.listDepartments();
    return successResponse(departments);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve departments', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission('team.create', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const body = await req.json();
    const parsed = departmentSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid department payload', 400, parsed.error.flatten());
    }

    const dept = await TeamService.createDepartment(parsed.data);
    return successResponse(dept, 201);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to create department', 500);
  }
}

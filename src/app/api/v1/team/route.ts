import { NextRequest } from 'next/server';
import { TeamService } from '@/services/team.service';
import { requirePermission } from '@/lib/api/guard';
import { teamMemberSchema } from '@/lib/validations/team';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const isFounder = searchParams.has('founder') ? searchParams.get('founder') === 'true' : undefined;
    const departmentId = searchParams.get('departmentId') || undefined;
    const isActive = searchParams.has('active') ? searchParams.get('active') === 'true' : undefined;

    const members = await TeamService.list({ isFounder, departmentId, isActive });
    return successResponse(members);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve team members', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission('team.create', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const body = await req.json();
    const parsed = teamMemberSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid team member payload', 400, parsed.error.flatten());
    }

    const member = await TeamService.create({
      ...parsed.data,
      userId: auth.session.userId,
    });

    return successResponse(member, 201);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to create team member', 500);
  }
}

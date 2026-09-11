import { TeamService } from '@/services/team.service';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function GET() {
  try {
    const founders = await TeamService.list({ isFounder: true, isActive: true });
    return successResponse(founders);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve founders', 500);
  }
}

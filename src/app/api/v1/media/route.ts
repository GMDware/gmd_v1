import { NextRequest } from 'next/server';
import { MediaService } from '@/services/media.service';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { getStorageStatus } from '@/lib/media';

export async function GET(req: NextRequest) {
  try {
    const auth = await requirePermission('media.read', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const result = await MediaService.list({ page, limit });
    const mapped = result.items.map((item) => ({
      ...item,
      url: item.storageUrl,
      size: item.sizeBytes,
      filename: item.fileName,
    }));
    return successResponse(mapped, 200, {
      ...result.pagination,
      storage: getStorageStatus(),
    });
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to list media assets', 500);
  }
}

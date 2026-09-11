import { NextRequest } from 'next/server';
import { ServicesService } from '@/services/service.service';
import { requirePermission } from '@/lib/api/guard';
import { serviceSchema } from '@/lib/validations/service';
import { successResponse, errorResponse } from '@/lib/api/response';
import { PublicationStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status') as PublicationStatus | null;
    const isFeatured = searchParams.has('featured') ? searchParams.get('featured') === 'true' : undefined;
    const isActive = searchParams.has('active') ? searchParams.get('active') === 'true' : undefined;

    const services = await ServicesService.list({
      status: status || undefined,
      isFeatured,
      isActive,
    });

    return successResponse(services);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve services', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission('services.create', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const body = await req.json();
    const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid service payload', 400, parsed.error.flatten());
    }

    const service = await ServicesService.create({
      ...parsed.data,
      userId: auth.session.userId,
    });

    return successResponse(service, 201);
  } catch (err: any) {
    if (err.message.includes('already exists')) {
      return errorResponse('DUPLICATE_SLUG', err.message, 409);
    }
    return errorResponse('SERVER_ERROR', err.message || 'Failed to create service', 500);
  }
}

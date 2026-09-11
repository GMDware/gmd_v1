import { NextRequest } from 'next/server';
import { ProjectService } from '@/services/project.service';
import { requirePermission } from '@/lib/api/guard';
import { projectSchema } from '@/lib/validations/project';
import { successResponse, errorResponse } from '@/lib/api/response';
import { PublicationStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status') as PublicationStatus | null;
    const categoryId = searchParams.get('categoryId') || undefined;
    const categorySlug = searchParams.get('categorySlug') || undefined;
    const search = searchParams.get('search') || undefined;
    const featuredOnly = searchParams.get('featured') === 'true';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const result = await ProjectService.list({
      status: status || undefined,
      categoryId,
      categorySlug,
      search,
      isFeatured: featuredOnly || undefined,
      page,
      limit,
    });

    return successResponse(result.items, 200, result.pagination);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve projects', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission('projects.create', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const body = await req.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid project payload', 400, parsed.error.flatten());
    }

    const project = await ProjectService.create({
      ...parsed.data,
      userId: auth.session.userId,
    });

    return successResponse(project, 201);
  } catch (err: any) {
    if (err.message.includes('already exists')) {
      return errorResponse('DUPLICATE_SLUG', err.message, 409);
    }
    return errorResponse('SERVER_ERROR', err.message || 'Failed to create project', 500);
  }
}

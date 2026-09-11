import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { successResponse, errorResponse } from '@/lib/api/response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.projectCategory.findMany({
      orderBy: { order: 'asc' },
    });
    return successResponse(categories);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve categories', 500);
  }
}

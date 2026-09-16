import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requirePermission } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let categories = await prisma.projectCategory.findMany({
      orderBy: { order: 'asc' },
    });

    if (categories.length === 0) {
      const defaultCategories = [
        { name: 'Enterprise Platforms', slug: 'enterprise-platforms', order: 1 },
        { name: 'Distributed Systems', slug: 'distributed-systems', order: 2 },
        { name: 'Cloud & Infrastructure', slug: 'cloud-infrastructure', order: 3 },
        { name: 'Design & Design Systems', slug: 'design-systems', order: 4 },
        { name: 'AI & Intelligent Systems', slug: 'ai-intelligent-systems', order: 5 },
      ];

      for (const cat of defaultCategories) {
        await prisma.projectCategory.upsert({
          where: { slug: cat.slug },
          update: { name: cat.name },
          create: cat,
        });
      }

      categories = await prisma.projectCategory.findMany({
        orderBy: { order: 'asc' },
      });
    }

    return successResponse(categories);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to retrieve categories', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission('projects.create', req);
    if (!auth.authorized || !auth.session) {
      return auth.response!;
    }

    const body = await req.json();
    const name = body.name?.trim();
    if (!name) {
      return errorResponse('VALIDATION_ERROR', 'Category name is required', 400);
    }

    const slug =
      body.slug?.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const order = typeof body.order === 'number' ? body.order : 0;

    const category = await prisma.projectCategory.upsert({
      where: { slug },
      update: { name },
      create: { name, slug, order },
    });

    return successResponse(category, 201);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to create category', 500);
  }
}


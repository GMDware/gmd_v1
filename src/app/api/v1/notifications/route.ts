import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAuth } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { isDatabaseReachable } from '@/lib/db/data-store';
import { ContactStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.authorized || !auth.session) {
    return auth.response!;
  }

  try {
    if (!(await isDatabaseReachable())) {
      return successResponse({
        unreadCount: 0,
        totalInquiries: 0,
        recentInquiries: [],
      });
    }

    const [unreadCount, totalInquiries, recentInquiries] = await Promise.all([
      prisma.contactSubmission.count({ where: { status: 'NEW' } }),
      prisma.contactSubmission.count(),
      prisma.contactSubmission.findMany({
        where: { status: 'NEW' },
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: {
          id: true,
          fullName: true,
          email: true,
          companyName: true,
          projectType: true,
          message: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    // If there are no NEW ones, get the 3 most recent submissions so the admin can still view activity
    let displayInquiries = recentInquiries;
    if (displayInquiries.length === 0) {
      displayInquiries = await prisma.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
          id: true,
          fullName: true,
          email: true,
          companyName: true,
          projectType: true,
          message: true,
          status: true,
          createdAt: true,
        },
      });
    }

    return successResponse({
      unreadCount,
      totalInquiries,
      recentInquiries: displayInquiries,
    });
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to fetch notifications', 500);
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.authorized || !auth.session) {
    return auth.response!;
  }

  try {
    const body = await req.json();

    if (body.action === 'MARK_ALL_READ') {
      const updated = await prisma.contactSubmission.updateMany({
        where: { status: 'NEW' },
        data: { status: 'READ' },
      });
      return successResponse({
        success: true,
        count: updated.count,
        message: 'All notifications marked as read',
      });
    }

    if (body.id) {
      const status: ContactStatus = body.status || 'READ';
      const updated = await prisma.contactSubmission.update({
        where: { id: body.id },
        data: { status },
      });
      return successResponse(updated);
    }

    return errorResponse('VALIDATION_ERROR', 'Invalid action payload', 400);
  } catch (err: any) {
    return errorResponse('SERVER_ERROR', err.message || 'Failed to update notifications', 500);
  }
}

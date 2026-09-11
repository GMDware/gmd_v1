import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAuth } from '@/lib/api/guard';
import { successResponse, errorResponse } from '@/lib/api/response';
import { AuthService } from '@/services/auth.service';

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.authorized || !auth.session) {
    return auth.response!;
  }

  try {
    const startTime = Date.now();

    const [
      totalProjects,
      publishedProjects,
      totalTeam,
      totalFounders,
      totalServices,
      unreadInquiries,
      recentLogs,
    ] = await Promise.all([
      prisma.project.count({ where: { deletedAt: null } }),
      prisma.project.count({ where: { status: 'PUBLISHED', deletedAt: null } }),
      prisma.teamMember.count({ where: { deletedAt: null } }),
      prisma.teamMember.count({ where: { isFounder: true, deletedAt: null } }),
      prisma.service.count({ where: { deletedAt: null } }),
      prisma.contactSubmission.count({ where: { status: 'NEW' } }),
      AuthService.getRecentLogs(10),
    ]);

    const dbLatencyMs = Date.now() - startTime;

    return successResponse({
      counts: {
        totalProjects,
        publishedProjects,
        totalTeam,
        totalFounders,
        totalServices,
        unreadInquiries,
      },
      recentActivity: recentLogs.map((log) => ({
        id: log.id,
        action: log.action,
        entity: log.entity,
        entityId: log.entityId,
        metadata: log.metadata,
        createdAt: log.createdAt,
        user: log.user
          ? {
              name: log.user.name,
              email: log.user.email,
              avatarUrl: log.user.avatarUrl,
            }
          : null,
      })),
      systemHealth: {
        database: 'CONNECTED',
        dbLatencyMs,
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return errorResponse('INTERNAL_ERROR', err.message || 'Failed to aggregate dashboard metrics', 500);
  }
}

import { NextRequest } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';
import { verifyAdminToken, AdminTokenPayload } from '@/lib/auth/jwt';
import { errorResponse } from './response';
import prisma from '@/lib/db/prisma';

export interface GuardResult {
  authorized: boolean;
  session?: AdminTokenPayload;
  response?: ReturnType<typeof errorResponse>;
}

/**
 * Validates that an incoming request has a valid admin session
 */
export async function requireAuth(req?: NextRequest): Promise<GuardResult> {
  let token: string | undefined;

  // 1. Check Authorization Header Bearer token
  if (req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }

  // 2. Check HttpOnly Cookie if no bearer token
  let session: AdminTokenPayload | null = null;

  if (token) {
    session = await verifyAdminToken(token);
  } else {
    session = await getAdminSession();
  }

  if (!session) {
    return {
      authorized: false,
      response: errorResponse('UNAUTHORIZED', 'Authentication is required to access this resource', 401),
    };
  }

  return { authorized: true, session };
}

/**
 * Validates that an incoming request has the exact permission action
 */
export async function requirePermission(
  action: string,
  req?: NextRequest
): Promise<GuardResult> {
  const auth = await requireAuth(req);
  if (!auth.authorized || !auth.session) {
    return auth;
  }

  const { roles, userId } = auth.session;

  // 1. Administrator role has global bypass
  if (roles.includes('Administrator')) {
    return { authorized: true, session: auth.session };
  }

  // 2. Query user permissions from database
  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return {
        authorized: false,
        response: errorResponse('FORBIDDEN', 'User account is inactive or disabled', 403),
      };
    }

    const hasAction = user.roles.some((ur) =>
      ur.role.permissions.some((rp) => rp.permission.action === action)
    );

    if (!hasAction) {
      return {
        authorized: false,
        response: errorResponse(
          'FORBIDDEN',
          `Missing required permission: ${action}`,
          403
        ),
      };
    }

    return { authorized: true, session: auth.session };
  } catch (err) {
    return {
      authorized: false,
      response: errorResponse('INTERNAL_ERROR', 'Failed to verify permission state', 500),
    };
  }
}

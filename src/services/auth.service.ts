import crypto from 'crypto';
import prisma from '@/lib/db/prisma';
import { isDatabaseReachable } from '@/lib/db/data-store';
import { verifyPassword, signAdminToken } from '@/lib/auth/jwt';

/**
 * Constant-time comparison for secret tokens and passwords to mitigate timing attacks
 */
function verifyTimingSafe(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export interface SeedAdminUser {
  id: string;
  email: string;
  password: string;
  name: string;
  roles: string[];
  permissions: string[];
}

export const SEED_ADMIN_USERS: SeedAdminUser[] = [
  {
    id: 'seed-admin-id',
    email: 'admin@gmdware.com',
    password: 'GMDware2026!',
    name: 'Principal Administrator',
    roles: ['Administrator'],
    permissions: [
      'projects.read',
      'projects.create',
      'projects.update',
      'projects.delete',
      'team.read',
      'team.create',
      'team.update',
      'team.delete',
      'services.read',
      'services.create',
      'services.update',
      'services.delete',
      'technologies.read',
      'technologies.create',
      'technologies.update',
      'technologies.delete',
      'content.read',
      'content.update',
      'contact.read',
      'contact.update',
      'settings.read',
      'settings.update',
      'media.read',
      'media.upload',
      'media.delete',
      'users.manage',
    ],
  },
  {
    id: 'seed-editor-id',
    email: 'editor@gmdware.com',
    password: 'GMDware2026!',
    name: 'Content Editor',
    roles: ['Editor'],
    permissions: [
      'projects.read',
      'projects.create',
      'projects.update',
      'team.read',
      'team.create',
      'team.update',
      'services.read',
      'services.create',
      'services.update',
      'technologies.read',
      'technologies.create',
      'technologies.update',
      'content.read',
      'content.update',
      'contact.read',
      'contact.update',
      'media.read',
      'media.upload',
      'settings.read',
    ],
  },
  {
    id: 'seed-viewer-id',
    email: 'viewer@gmdware.com',
    password: 'GMDware2026!',
    name: 'System Inspector (Viewer)',
    roles: ['Viewer'],
    permissions: [
      'projects.read',
      'team.read',
      'services.read',
      'technologies.read',
      'content.read',
      'contact.read',
      'media.read',
      'settings.read',
    ],
  },
];

export class AuthService {
  /**
   * Authenticates an administrative user by email and password.
   * Seamlessly checks PostgreSQL when available, and falls back to baseline seed administrators
   * when database server is offline or during initial setup.
   */
  static async login(email: string, plainPassword: string) {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Database-backed authentication when DB is reachable
    if (await isDatabaseReachable()) {
      try {
        const user = await prisma.adminUser.findUnique({
          where: { email: normalizedEmail },
          include: {
            roles: {
              include: {
                role: {
                  include: {
                    permissions: { include: { permission: true } },
                  },
                },
              },
            },
          },
        });

        if (user && user.isActive && !user.deletedAt) {
          const isMatch = await verifyPassword(plainPassword, user.passwordHash);
          if (isMatch) {
            try {
              await prisma.adminUser.update({
                where: { id: user.id },
                data: { lastLoginAt: new Date() },
              });
            } catch {
              // Ignore update failure
            }

            const roleNames = user.roles.map((r) => r.role.name);
            const permissionActions = Array.from(
              new Set(
                user.roles.flatMap((r) =>
                  r.role.permissions.map((rp) => rp.permission.action)
                )
              )
            );

            const sessionPayload = {
              userId: user.id,
              email: user.email,
              name: user.name,
              roles: roleNames,
            };

            const token = await signAdminToken(sessionPayload, '7d');

            await this.logAudit({
              userId: user.id,
              action: 'LOGIN',
              entity: 'AdminUser',
              entityId: user.id,
              metadata: { email: user.email },
            });

            return {
              success: true,
              token,
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatarUrl: user.avatarUrl,
                roles: roleNames,
                permissions: permissionActions,
              },
            };
          }
        }
      } catch {
        // Fall through to seed user authentication on connection failure
      }
    }

    // 2. Resilient fallback authentication for initial provisioning & offline resiliency
    const isProd = process.env.NODE_ENV === 'production';
    const envAdminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const envAdminPassword = process.env.ADMIN_PASSWORD;

    // In production, fallback requires explicit ADMIN_EMAIL and ADMIN_PASSWORD environment variables
    if (isProd) {
      if (envAdminEmail && envAdminPassword && normalizedEmail === envAdminEmail) {
        const isMatch = verifyTimingSafe(plainPassword, envAdminPassword);
        if (isMatch) {
          const sessionPayload = {
            userId: 'env-super-admin',
            email: envAdminEmail,
            name: 'Principal Administrator',
            roles: ['Administrator'],
          };

          const token = await signAdminToken(sessionPayload, '7d');

          return {
            success: true,
            token,
            user: {
              id: 'env-super-admin',
              email: envAdminEmail,
              name: 'Principal Administrator',
              avatarUrl: null,
              roles: ['Administrator'],
              permissions: SEED_ADMIN_USERS[0].permissions,
            },
          };
        }
      }

      return {
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials or inactive account',
      };
    }

    // In development / test environments: support configured env vars or seed accounts
    const seedUser = SEED_ADMIN_USERS.find((u) => u.email === normalizedEmail);
    if (seedUser) {
      const targetPassword =
        seedUser.id === 'seed-admin-id' && envAdminPassword
          ? envAdminPassword
          : seedUser.password;

      if (verifyTimingSafe(plainPassword, targetPassword)) {
        const sessionPayload = {
          userId: seedUser.id,
          email: seedUser.email,
          name: seedUser.name,
          roles: seedUser.roles,
        };

        const token = await signAdminToken(sessionPayload, '7d');

        return {
          success: true,
          token,
          user: {
            id: seedUser.id,
            email: seedUser.email,
            name: seedUser.name,
            avatarUrl: null,
            roles: seedUser.roles,
            permissions: seedUser.permissions,
          },
        };
      }
    }

    return {
      success: false,
      error: 'INVALID_CREDENTIALS',
      message: 'Invalid credentials or inactive account',
    };
  }

  /**
   * Retrieves profile and granted permissions for the authenticated session
   */
  static async getCurrentUser(userId: string) {
    if (await isDatabaseReachable()) {
      try {
        const user = await prisma.adminUser.findUnique({
          where: { id: userId },
          include: {
            roles: {
              include: {
                role: {
                  include: {
                    permissions: { include: { permission: true } },
                  },
                },
              },
            },
          },
        });

        if (user && user.isActive) {
          const roleNames = user.roles.map((r) => r.role.name);
          const permissionActions = Array.from(
            new Set(
              user.roles.flatMap((r) =>
                r.role.permissions.map((rp) => rp.permission.action)
              )
            )
          );

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl,
            roles: roleNames,
            permissions: permissionActions,
          };
        }
      } catch {
        // Fall back to seed users
      }
    }

    const seed =
      SEED_ADMIN_USERS.find((u) => u.id === userId) || SEED_ADMIN_USERS[0];
    return {
      id: seed.id,
      email: seed.email,
      name: seed.name,
      avatarUrl: null,
      roles: seed.roles,
      permissions: seed.permissions,
    };
  }

  /**
   * Creates an administrative audit log entry
   */
  static async logAudit(params: {
    userId?: string;
    action: string;
    entity: string;
    entityId: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    if (!(await isDatabaseReachable())) {
      return null;
    }

    try {
      return await prisma.auditLog.create({
        data: {
          userId: params.userId,
          action: params.action,
          entity: params.entity,
          entityId: params.entityId,
          metadata: params.metadata ? JSON.stringify(params.metadata) : undefined,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        },
      });
    } catch {
      return null;
    }
  }

  /**
   * Retrieves recent audit logs with user information
   */
  static async getRecentLogs(limit = 15) {
    if (!(await isDatabaseReachable())) {
      return [];
    }

    try {
      return await prisma.auditLog.findMany({
        take: Math.min(100, Math.max(1, limit)),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      });
    } catch {
      return [];
    }
  }
}

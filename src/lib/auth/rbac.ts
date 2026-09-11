import { AdminTokenPayload } from './jwt';

export type UserRoleType = 'SUPER_ADMIN' | 'CONTENT_ADMIN' | 'EDITOR';

export type PermissionAction =
  | 'projects:create'
  | 'projects:update'
  | 'projects:delete'
  | 'team:create'
  | 'team:update'
  | 'team:delete'
  | 'services:create'
  | 'services:update'
  | 'services:delete'
  | 'insights:publish'
  | 'settings:update'
  | 'users:manage'
  | 'inquiries:manage';

const ROLE_PERMISSIONS: Record<UserRoleType, PermissionAction[]> = {
  SUPER_ADMIN: [
    'projects:create',
    'projects:update',
    'projects:delete',
    'team:create',
    'team:update',
    'team:delete',
    'services:create',
    'services:update',
    'services:delete',
    'insights:publish',
    'settings:update',
    'users:manage',
    'inquiries:manage',
  ],
  CONTENT_ADMIN: [
    'projects:create',
    'projects:update',
    'team:create',
    'team:update',
    'services:create',
    'services:update',
    'insights:publish',
    'inquiries:manage',
  ],
  EDITOR: [
    'projects:create',
    'projects:update',
    'team:update',
    'services:update',
  ],
};

/**
 * Checks if the session possesses the required permission
 */
export function hasPermission(
  session: AdminTokenPayload | null,
  action: PermissionAction
): boolean {
  if (!session || !session.roles || session.roles.length === 0) return false;

  return session.roles.some((role) => {
    const permissions = ROLE_PERMISSIONS[role as UserRoleType];
    return permissions ? permissions.includes(action) : false;
  });
}

/**
 * Checks if the session is a Super Admin
 */
export function isSuperAdmin(session: AdminTokenPayload | null): boolean {
  if (!session || !session.roles) return false;
  return session.roles.includes('SUPER_ADMIN');
}

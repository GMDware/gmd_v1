import prisma from '@/lib/db/prisma';
import { AuthService } from './auth.service';
import { resolvePublicMediaUrl } from '@/lib/media';

export class TeamService {
  /**
   * List team members with founder/department filters
   */
  static async list(options: { isFounder?: boolean; departmentId?: string; isActive?: boolean } = {}) {
    const where: Record<string, any> = { deletedAt: null };

    if (options.isFounder !== undefined) {
      where.isFounder = options.isFounder;
    }
    if (options.departmentId) {
      where.departmentId = options.departmentId;
    }
    if (options.isActive !== undefined) {
      where.isActive = options.isActive;
    }

    const members = await prisma.teamMember.findMany({
      where,
      orderBy: [{ isFounder: 'desc' }, { displayOrder: 'asc' }],
      include: {
        department: true,
        role: true,
        image: true,
        socialLinks: true,
      },
    });

    return members.map((m) => ({
      ...m,
      image: m.image
        ? {
            ...m.image,
            url: resolvePublicMediaUrl(m.image),
          }
        : null,
    }));
  }

  /**
   * Get single team member by ID
   */
  static async getById(id: string) {
    const member = await prisma.teamMember.findFirst({
      where: { id, deletedAt: null },
      include: {
        department: true,
        role: true,
        image: true,
        socialLinks: true,
      },
    });

    if (!member) return null;

    return {
      ...member,
      image: member.image
        ? {
            ...member.image,
            url: resolvePublicMediaUrl(member.image),
          }
        : null,
    };
  }

  /**
   * Create a new team member or founder
   */
  static async create(data: {
    name: string;
    displayName: string;
    isFounder?: boolean;
    founderTitle?: string | null;
    roleId: string;
    departmentId: string;
    shortBio: string;
    fullBio?: string | null;
    imageId?: string | null;
    skills?: string[];
    githubUrl?: string | null;
    linkedinUrl?: string | null;
    websiteUrl?: string | null;
    email?: string | null;
    showEmail?: boolean;
    isFeatured?: boolean;
    displayOrder?: number;
    isActive?: boolean;
    userId?: string;
  }) {
    const { userId, ...createData } = data;
    if (createData.imageId === '') {
      createData.imageId = null;
    }

    const member = await prisma.teamMember.create({
      data: createData,
      include: {
        department: true,
        role: true,
        image: true,
      },
    });

    if (userId) {
      await AuthService.logAudit({
        userId,
        action: 'CREATE',
        entity: 'TeamMember',
        entityId: member.id,
        metadata: { name: member.name, isFounder: member.isFounder },
      });
    }

    return {
      ...member,
      image: member.image
        ? {
            ...member.image,
            url: resolvePublicMediaUrl(member.image),
          }
        : null,
    };
  }

  /**
   * Update a team member
   */
  static async update(
    id: string,
    data: Partial<{
      name: string;
      displayName: string;
      isFounder: boolean;
      founderTitle: string | null;
      roleId: string;
      departmentId: string;
      shortBio: string;
      fullBio: string | null;
      imageId: string | null;
      skills: string[];
      githubUrl: string | null;
      linkedinUrl: string | null;
      websiteUrl: string | null;
      email: string | null;
      showEmail: boolean;
      isFeatured: boolean;
      displayOrder: number;
      isActive: boolean;
      userId: string;
    }>
  ) {
    const existing = await prisma.teamMember.findFirst({ where: { id, deletedAt: null } });
    if (!existing) {
      throw new Error(`Team member with ID "${id}" not found`);
    }

    const { userId, ...updateData } = data;
    if (updateData.imageId === '') {
      updateData.imageId = null;
    }

    const updated = await prisma.teamMember.update({
      where: { id },
      data: updateData,
      include: {
        department: true,
        role: true,
        image: true,
      },
    });

    if (userId) {
      await AuthService.logAudit({
        userId,
        action: 'UPDATE',
        entity: 'TeamMember',
        entityId: id,
        metadata: updateData,
      });
    }

    return {
      ...updated,
      image: updated.image
        ? {
            ...updated.image,
            url: resolvePublicMediaUrl(updated.image),
          }
        : null,
    };
  }

  /**
   * Soft delete a team member
   */
  static async softDelete(id: string, userId?: string) {
    const updated = await prisma.teamMember.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });

    if (userId) {
      await AuthService.logAudit({
        userId,
        action: 'DELETE',
        entity: 'TeamMember',
        entityId: id,
        metadata: { name: updated.name },
      });
    }

    return updated;
  }

  /**
   * List all departments (auto-provisions defaults if empty)
   */
  static async listDepartments() {
    let depts = await prisma.department.findMany({
      orderBy: { order: 'asc' },
      include: { members: { where: { deletedAt: null, isActive: true } } },
    });

    if (depts.length === 0) {
      const defaultDepts = [
        { name: 'Engineering', slug: 'engineering', order: 1 },
        { name: 'Systems Architecture', slug: 'systems-architecture', order: 2 },
        { name: 'Design & Product Systems', slug: 'design-systems', order: 3 },
        { name: 'Executive Leadership', slug: 'leadership', order: 4 },
      ];

      for (const d of defaultDepts) {
        await prisma.department.upsert({
          where: { slug: d.slug },
          update: {},
          create: d,
        });
      }

      depts = await prisma.department.findMany({
        orderBy: { order: 'asc' },
        include: { members: { where: { deletedAt: null, isActive: true } } },
      });
    }

    return depts;
  }

  /**
   * Create department
   */
  static async createDepartment(data: { name: string; slug?: string; order?: number }) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return prisma.department.upsert({
      where: { slug },
      update: { name: data.name },
      create: { name: data.name, slug, order: data.order || 0 },
    });
  }

  /**
   * List team roles (auto-provisions defaults if empty)
   */
  static async listRoles() {
    let roles = await prisma.teamRole.findMany({
      orderBy: { title: 'asc' },
    });

    if (roles.length === 0) {
      const defaultRoles = [
        'Chief Architect',
        'Senior Software Engineer',
        'Principal Systems Architect',
        'Lead Product Designer',
        'Infrastructure Engineer',
        'Founding Architect',
      ];

      for (let i = 0; i < defaultRoles.length; i++) {
        await prisma.teamRole.upsert({
          where: { title: defaultRoles[i] },
          update: {},
          create: { title: defaultRoles[i] },
        });
      }

      roles = await prisma.teamRole.findMany({
        orderBy: { title: 'asc' },
      });
    }

    return roles;
  }

  /**
   * Create team role
   */
  static async createRole(data: { title: string; department?: string }) {
    return prisma.teamRole.upsert({
      where: { title: data.title.trim() },
      update: {},
      create: { title: data.title.trim(), department: data.department },
    });
  }
}

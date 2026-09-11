import prisma from '@/lib/db/prisma';
import { AuthService } from './auth.service';

export class TechnologyService {
  static async list(options: { category?: string; isFeatured?: boolean; isActive?: boolean } = {}) {
    const where: Record<string, any> = {};

    if (options.category) where.category = options.category;
    if (options.isFeatured !== undefined) where.isFeatured = options.isFeatured;
    if (options.isActive !== undefined) where.isActive = options.isActive;

    return prisma.technology.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });
  }

  static async getById(id: string) {
    return prisma.technology.findUnique({ where: { id } });
  }

  static async create(data: {
    name: string;
    slug: string;
    category: string;
    logoUrl?: string | null;
    description?: string | null;
    url?: string | null;
    isFeatured?: boolean;
    isActive?: boolean;
    displayOrder?: number;
    userId?: string;
  }) {
    const existing = await prisma.technology.findUnique({ where: { slug: data.slug } });
    if (existing) {
      throw new Error(`Technology with slug "${data.slug}" already exists`);
    }

    const { userId, ...createData } = data;
    const tech = await prisma.technology.create({ data: createData });

    if (userId) {
      await AuthService.logAudit({
        userId,
        action: 'CREATE',
        entity: 'Technology',
        entityId: tech.id,
        metadata: { name: tech.name },
      });
    }

    return tech;
  }

  static async update(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
      category: string;
      logoUrl: string | null;
      description: string | null;
      url: string | null;
      isFeatured: boolean;
      isActive: boolean;
      displayOrder: number;
      userId: string;
    }>
  ) {
    const existing = await prisma.technology.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`Technology with ID "${id}" not found`);
    }

    if (data.slug && data.slug !== existing.slug) {
      const duplicate = await prisma.technology.findUnique({ where: { slug: data.slug } });
      if (duplicate && duplicate.id !== id) {
        throw new Error(`Technology with slug "${data.slug}" already exists`);
      }
    }

    const { userId, ...updateData } = data;
    const updated = await prisma.technology.update({
      where: { id },
      data: updateData,
    });

    if (userId) {
      await AuthService.logAudit({
        userId,
        action: 'UPDATE',
        entity: 'Technology',
        entityId: id,
        metadata: updateData,
      });
    }

    return updated;
  }

  static async delete(id: string, userId?: string) {
    const deleted = await prisma.technology.delete({ where: { id } });

    if (userId) {
      await AuthService.logAudit({
        userId,
        action: 'DELETE',
        entity: 'Technology',
        entityId: id,
        metadata: { name: deleted.name },
      });
    }

    return deleted;
  }
}

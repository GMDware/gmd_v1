import prisma from '@/lib/db/prisma';
import { PublicationStatus } from '@prisma/client';
import { AuthService } from './auth.service';

export class ServicesService {
  static async list(options: { status?: PublicationStatus; isFeatured?: boolean; isActive?: boolean } = {}) {
    const where: Record<string, any> = { deletedAt: null };

    if (options.status) where.status = options.status;
    if (options.isFeatured !== undefined) where.isFeatured = options.isFeatured;
    if (options.isActive !== undefined) where.isActive = options.isActive;

    return prisma.service.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      include: {
        features: { orderBy: { displayOrder: 'asc' } },
        technologies: { include: { technology: true } },
        heroImage: true,
      },
    });
  }

  static async getById(id: string) {
    return prisma.service.findFirst({
      where: { id, deletedAt: null },
      include: {
        features: { orderBy: { displayOrder: 'asc' } },
        technologies: { include: { technology: true } },
        heroImage: true,
      },
    });
  }

  static async getBySlug(slug: string) {
    return prisma.service.findFirst({
      where: { slug, deletedAt: null },
      include: {
        features: { orderBy: { displayOrder: 'asc' } },
        technologies: { include: { technology: true } },
        heroImage: true,
      },
    });
  }

  static async create(data: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    iconName?: string | null;
    heroImageId?: string | null;
    status?: PublicationStatus;
    displayOrder?: number;
    isFeatured?: boolean;
    isActive?: boolean;
    seoTitle?: string | null;
    seoDescription?: string | null;
    features?: Array<{ title: string; description: string; displayOrder?: number }>;
    technologyIds?: string[];
    userId?: string;
  }) {
    const existing = await prisma.service.findUnique({ where: { slug: data.slug } });
    if (existing) {
      throw new Error(`A service with slug "${data.slug}" already exists`);
    }

    const { features, technologyIds, userId, ...serviceData } = data;

    const service = await prisma.service.create({
      data: {
        ...serviceData,
        features: features?.length
          ? {
              create: features.map((f, i) => ({
                title: f.title,
                description: f.description,
                displayOrder: f.displayOrder ?? i,
              })),
            }
          : undefined,
        technologies: technologyIds?.length
          ? {
              create: technologyIds.map((tId) => ({ technologyId: tId })),
            }
          : undefined,
      },
      include: {
        features: true,
        technologies: { include: { technology: true } },
      },
    });

    if (userId) {
      await AuthService.logAudit({
        userId,
        action: 'CREATE',
        entity: 'Service',
        entityId: service.id,
        metadata: { title: service.title },
      });
    }

    return service;
  }

  static async update(
    id: string,
    data: Partial<{
      title: string;
      slug: string;
      summary: string;
      content: string;
      iconName: string | null;
      heroImageId: string | null;
      status: PublicationStatus;
      displayOrder: number;
      isFeatured: boolean;
      isActive: boolean;
      seoTitle: string | null;
      seoDescription: string | null;
      features: Array<{ title: string; description: string; displayOrder?: number }>;
      technologyIds: string[];
      userId: string;
    }>
  ) {
    const existing = await prisma.service.findFirst({ where: { id, deletedAt: null } });
    if (!existing) {
      throw new Error(`Service with ID "${id}" not found`);
    }

    if (data.slug && data.slug !== existing.slug) {
      const duplicate = await prisma.service.findUnique({ where: { slug: data.slug } });
      if (duplicate && duplicate.id !== id) {
        throw new Error(`A service with slug "${data.slug}" already exists`);
      }
    }

    const { features, technologyIds, userId, ...updateData } = data;

    // Replace features if provided
    if (features !== undefined) {
      await prisma.serviceFeature.deleteMany({ where: { serviceId: id } });
      if (features.length > 0) {
        await prisma.serviceFeature.createMany({
          data: features.map((f, i) => ({
            serviceId: id,
            title: f.title,
            description: f.description,
            displayOrder: f.displayOrder ?? i,
          })),
        });
      }
    }

    // Replace technology links if provided
    if (technologyIds !== undefined) {
      await prisma.serviceTechnology.deleteMany({ where: { serviceId: id } });
      if (technologyIds.length > 0) {
        await prisma.serviceTechnology.createMany({
          data: technologyIds.map((tId) => ({ serviceId: id, technologyId: tId })),
        });
      }
    }

    const updated = await prisma.service.update({
      where: { id },
      data: updateData,
      include: {
        features: true,
        technologies: { include: { technology: true } },
      },
    });

    if (userId) {
      await AuthService.logAudit({
        userId,
        action: 'UPDATE',
        entity: 'Service',
        entityId: id,
        metadata: updateData,
      });
    }

    return updated;
  }

  static async softDelete(id: string, userId?: string) {
    const updated = await prisma.service.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
        status: 'ARCHIVED',
      },
    });

    if (userId) {
      await AuthService.logAudit({
        userId,
        action: 'DELETE',
        entity: 'Service',
        entityId: id,
        metadata: { title: updated.title },
      });
    }

    return updated;
  }
}

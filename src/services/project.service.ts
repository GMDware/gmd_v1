import prisma from '@/lib/db/prisma';
import { PublicationStatus } from '@prisma/client';
import { AuthService } from './auth.service';

export interface ProjectFilterOptions {
  status?: PublicationStatus;
  categoryId?: string;
  categorySlug?: string;
  isFeatured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export class ProjectService {
  /**
   * List projects with filtering, search, and pagination
   */
  static async list(options: ProjectFilterOptions = {}) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const skip = (page - 1) * limit;

    const where: Record<string, any> = { deletedAt: null };

    if (options.status) {
      where.status = options.status;
    }
    if (options.isFeatured !== undefined) {
      where.isFeatured = options.isFeatured;
    }
    if (options.categoryId) {
      where.categoryId = options.categoryId;
    }
    if (options.categorySlug) {
      where.category = { slug: options.categorySlug };
    }
    if (options.search) {
      where.OR = [
        { title: { contains: options.search, mode: 'insensitive' } },
        { shortDescription: { contains: options.search, mode: 'insensitive' } },
        { slug: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const [total, projects] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
        include: {
          category: true,
          caseStudy: true,
          heroImage: true,
          technologies: { include: { technology: true } },
          gallery: { include: { mediaAsset: true }, orderBy: { displayOrder: 'asc' } },
        },
      }),
    ]);

    return {
      items: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single project by ID or Slug
   */
  static async getById(id: string) {
    return prisma.project.findFirst({
      where: { id, deletedAt: null },
      include: {
        category: true,
        caseStudy: true,
        heroImage: true,
        technologies: { include: { technology: true } },
        gallery: { include: { mediaAsset: true }, orderBy: { displayOrder: 'asc' } },
      },
    });
  }

  static async getBySlug(slug: string) {
    return prisma.project.findFirst({
      where: { slug, deletedAt: null },
      include: {
        category: true,
        caseStudy: true,
        heroImage: true,
        technologies: { include: { technology: true } },
        gallery: { include: { mediaAsset: true }, orderBy: { displayOrder: 'asc' } },
      },
    });
  }

  /**
   * Create a new project with relations
   */
  static async create(data: {
    title: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    categoryId: string;
    clientName?: string | null;
    clientVisibility?: boolean;
    projectType: string;
    heroImageId?: string | null;
    challenge?: string | null;
    strategy?: string | null;
    designApproach?: string | null;
    architecture?: string | null;
    development?: string | null;
    infrastructure?: string | null;
    results?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    seoKeywords?: string[];
    isFeatured?: boolean;
    status?: PublicationStatus;
    displayOrder?: number;
    technologyIds?: string[];
    caseStudy?: {
      summary: string;
      metrics?: any;
      testimonial?: any;
    } | null;
    userId?: string;
  }) {
    // 1. Verify slug uniqueness
    const existing = await prisma.project.findUnique({ where: { slug: data.slug } });
    if (existing) {
      throw new Error(`A project with slug "${data.slug}" already exists`);
    }

    const { technologyIds, caseStudy, userId, ...projectData } = data;

    const project = await prisma.project.create({
      data: {
        ...projectData,
        status: data.status || 'DRAFT',
        technologies: technologyIds?.length
          ? {
              create: technologyIds.map((techId) => ({ technologyId: techId })),
            }
          : undefined,
        caseStudy: caseStudy
          ? {
              create: {
                summary: caseStudy.summary,
                metrics: caseStudy.metrics,
                testimonial: caseStudy.testimonial,
                status: data.status || 'DRAFT',
              },
            }
          : undefined,
      },
      include: {
        category: true,
        caseStudy: true,
        technologies: { include: { technology: true } },
      },
    });

    if (userId) {
      await AuthService.logAudit({
        userId,
        action: 'CREATE',
        entity: 'Project',
        entityId: project.id,
        metadata: { title: project.title, slug: project.slug },
      });
    }

    return project;
  }

  /**
   * Update an existing project
   */
  static async update(
    id: string,
    data: Partial<{
      title: string;
      slug: string;
      shortDescription: string;
      fullDescription: string;
      categoryId: string;
      clientName: string | null;
      clientVisibility: boolean;
      projectType: string;
      heroImageId: string | null;
      challenge: string | null;
      strategy: string | null;
      designApproach: string | null;
      architecture: string | null;
      development: string | null;
      infrastructure: string | null;
      results: string | null;
      seoTitle: string | null;
      seoDescription: string | null;
      seoKeywords: string[];
      isFeatured: boolean;
      status: PublicationStatus;
      displayOrder: number;
      technologyIds: string[];
      caseStudy: {
        summary: string;
        metrics?: any;
        testimonial?: any;
      } | null;
      userId?: string;
    }>
  ) {
    const existing = await prisma.project.findFirst({ where: { id, deletedAt: null } });
    if (!existing) {
      throw new Error(`Project with ID "${id}" not found`);
    }

    if (data.slug && data.slug !== existing.slug) {
      const duplicate = await prisma.project.findUnique({ where: { slug: data.slug } });
      if (duplicate && duplicate.id !== id) {
        throw new Error(`A project with slug "${data.slug}" already exists`);
      }
    }

    const { technologyIds, caseStudy, userId, ...updateData } = data;

    // Handle technology relation re-linking if technologyIds provided
    if (technologyIds !== undefined) {
      await prisma.projectTechnology.deleteMany({ where: { projectId: id } });
      if (technologyIds.length > 0) {
        await prisma.projectTechnology.createMany({
          data: technologyIds.map((tId) => ({ projectId: id, technologyId: tId })),
        });
      }
    }

    // Handle case study update
    if (caseStudy) {
      await prisma.caseStudy.upsert({
        where: { projectId: id },
        create: {
          projectId: id,
          summary: caseStudy.summary,
          metrics: caseStudy.metrics,
          testimonial: caseStudy.testimonial,
          status: data.status || existing.status,
        },
        update: {
          summary: caseStudy.summary,
          metrics: caseStudy.metrics,
          testimonial: caseStudy.testimonial,
        },
      });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        caseStudy: true,
        technologies: { include: { technology: true } },
      },
    });

    if (userId) {
      await AuthService.logAudit({
        userId,
        action: 'UPDATE',
        entity: 'Project',
        entityId: id,
        metadata: updateData,
      });
    }

    return updated;
  }

  /**
   * Toggles publication status
   */
  static async setStatus(id: string, status: PublicationStatus, userId?: string) {
    const updated = await prisma.project.update({
      where: { id },
      data: { status },
    });

    if (userId) {
      await AuthService.logAudit({
        userId,
        action: status === 'PUBLISHED' ? 'PUBLISH' : 'UNPUBLISH',
        entity: 'Project',
        entityId: id,
        metadata: { status },
      });
    }

    return updated;
  }

  /**
   * Toggles featured status
   */
  static async setFeatured(id: string, isFeatured: boolean, userId?: string) {
    const updated = await prisma.project.update({
      where: { id },
      data: { isFeatured },
    });

    if (userId) {
      await AuthService.logAudit({
        userId,
        action: isFeatured ? 'FEATURE' : 'UNFEATURE',
        entity: 'Project',
        entityId: id,
        metadata: { isFeatured },
      });
    }

    return updated;
  }

  /**
   * Batch updates display ordering
   */
  static async reorder(items: Array<{ id: string; displayOrder: number }>, userId?: string) {
    const operations = items.map((item) =>
      prisma.project.update({
        where: { id: item.id },
        data: { displayOrder: item.displayOrder },
      })
    );

    const result = await prisma.$transaction(operations);

    if (userId) {
      await AuthService.logAudit({
        userId,
        action: 'REORDER',
        entity: 'Project',
        entityId: 'batch',
        metadata: { count: items.length },
      });
    }

    return result;
  }

  /**
   * Soft deletes a project
   */
  static async softDelete(id: string, userId?: string) {
    const updated = await prisma.project.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'ARCHIVED',
      },
    });

    if (userId) {
      await AuthService.logAudit({
        userId,
        action: 'DELETE',
        entity: 'Project',
        entityId: id,
        metadata: { title: updated.title },
      });
    }

    return updated;
  }
}

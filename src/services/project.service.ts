import prisma from '@/lib/db/prisma';
import { PublicationStatus } from '@prisma/client';
import { AuthService } from './auth.service';
import { isDatabaseReachable } from '@/lib/db/data-store';
import { INITIAL_SEED_DATA } from '@/lib/db/seed-data';

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
   * Auto-seed baseline projects from INITIAL_SEED_DATA into database if project count is 0
   */
  static async autoSeedIfEmpty() {
    try {
      const count = await prisma.project.count({ where: { deletedAt: null } });
      if (count > 0) return;

      // Ensure categories exist
      const categoryMap = new Map<string, string>();
      for (const cat of INITIAL_SEED_DATA.projectCategories) {
        const createdCat = await prisma.projectCategory.upsert({
          where: { slug: cat.slug },
          update: { name: cat.name },
          create: { name: cat.name, slug: cat.slug, order: cat.order },
        });
        categoryMap.set(cat.id, createdCat.id);
        categoryMap.set(cat.slug, createdCat.id);
      }

      // Ensure technologies exist
      const techMap = new Map<string, string>();
      for (const tech of INITIAL_SEED_DATA.technologies) {
        const createdTech = await prisma.technology.upsert({
          where: { slug: tech.slug },
          update: { name: tech.name },
          create: {
            name: tech.name,
            slug: tech.slug,
            category: tech.category,
            description: tech.description,
            isFeatured: tech.isFeatured,
            displayOrder: tech.displayOrder,
          },
        });
        techMap.set(tech.id, createdTech.id);
        techMap.set(tech.slug, createdTech.id);
      }

      // Seed all projects
      for (const p of INITIAL_SEED_DATA.projects) {
        const resolvedCategoryId =
          categoryMap.get(p.categoryId) ||
          categoryMap.get((p as any).categorySlug) ||
          Array.from(categoryMap.values())[0];

        const resolvedTechIds = ((p as any).technologyIds || [])
          .map((id: string) => techMap.get(id))
          .filter(Boolean) as string[];

        const {
          caseStudy,
          technologyIds,
          categorySlug,
          uxApproach,
          uiApproach,
          liveUrl,
          href,
          isConcept,
          conceptBadge,
          archetype,
          ...projData
        } = p as any;

        await prisma.project.create({
          data: {
            ...projData,
            categoryId: resolvedCategoryId,
            technologies: resolvedTechIds.length
              ? {
                  create: resolvedTechIds.map((tId) => ({ technologyId: tId })),
                }
              : undefined,
            caseStudy: caseStudy
              ? {
                  create: {
                    summary: caseStudy.summary || '',
                    metrics: caseStudy.metrics,
                    testimonial: caseStudy.testimonial,
                    status: p.status || 'PUBLISHED',
                  },
                }
              : undefined,
          },
        });
      }
    } catch (seedErr) {
      console.error('Project auto-seed notice:', seedErr);
    }
  }

  /**
   * List projects with filtering, search, and pagination
   */
  static async list(options: ProjectFilterOptions = {}) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const skip = (page - 1) * limit;

    if (await isDatabaseReachable()) {
      try {
        await this.autoSeedIfEmpty();

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

        if (total > 0 || projects.length > 0) {
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
      } catch (dbErr) {
        console.warn('Database error in ProjectService.list, falling back to seed data:', dbErr);
      }
    }

    // Fallback on offline or unreachable DB
    let filtered = [...INITIAL_SEED_DATA.projects];
    if (options.status) {
      filtered = filtered.filter((p) => p.status === options.status);
    }
    if (options.isFeatured !== undefined) {
      filtered = filtered.filter((p) => p.isFeatured === options.isFeatured);
    }
    if (options.categoryId) {
      filtered = filtered.filter((p) => p.categoryId === options.categoryId);
    }
    if (options.categorySlug) {
      filtered = filtered.filter((p) => (p as any).categorySlug === options.categorySlug);
    }
    if (options.search) {
      const q = options.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit).map((p) => {
      const category = INITIAL_SEED_DATA.projectCategories.find((c) => c.id === p.categoryId) || {
        id: p.categoryId,
        name: (p as any).categorySlug || 'Enterprise Platforms',
        slug: (p as any).categorySlug || 'enterprise-platforms',
      };
      const technologies = ((p as any).technologyIds || [])
        .map((tId: string) => {
          const tech = INITIAL_SEED_DATA.technologies.find((t) => t.id === tId);
          return tech ? { technology: tech } : null;
        })
        .filter(Boolean);

      return {
        ...p,
        category,
        technologies,
      };
    });

    return {
      items: paginated,
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
    if (await isDatabaseReachable()) {
      try {
        const p = await prisma.project.findFirst({
          where: { id, deletedAt: null },
          include: {
            category: true,
            caseStudy: true,
            heroImage: true,
            technologies: { include: { technology: true } },
            gallery: { include: { mediaAsset: true }, orderBy: { displayOrder: 'asc' } },
          },
        });
        if (p) return p;
      } catch {}
    }

    const fallback = INITIAL_SEED_DATA.projects.find((p) => p.id === id);
    if (!fallback) return null;
    const category = INITIAL_SEED_DATA.projectCategories.find((c) => c.id === fallback.categoryId);
    const technologies = ((fallback as any).technologyIds || [])
      .map((tId: string) => ({
        technology: INITIAL_SEED_DATA.technologies.find((t) => t.id === tId),
      }))
      .filter((t: any) => Boolean(t.technology));
    return {
      ...fallback,
      category,
      technologies,
    };
  }

  static async getBySlug(slug: string) {
    if (await isDatabaseReachable()) {
      try {
        const p = await prisma.project.findFirst({
          where: { slug, deletedAt: null },
          include: {
            category: true,
            caseStudy: true,
            heroImage: true,
            technologies: { include: { technology: true } },
            gallery: { include: { mediaAsset: true }, orderBy: { displayOrder: 'asc' } },
          },
        });
        if (p) return p;
      } catch {}
    }

    const fallback = INITIAL_SEED_DATA.projects.find((p) => p.slug === slug);
    if (!fallback) return null;
    const category = INITIAL_SEED_DATA.projectCategories.find((c) => c.id === fallback.categoryId);
    const technologies = ((fallback as any).technologyIds || [])
      .map((tId: string) => ({
        technology: INITIAL_SEED_DATA.technologies.find((t) => t.id === tId),
      }))
      .filter((t: any) => Boolean(t.technology));
    return {
      ...fallback,
      category,
      technologies,
    };
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
      summary?: string;
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

    const { technologyIds, caseStudy, userId, uxApproach, uiApproach, ...projectData } = data as any;
    if (projectData.heroImageId === '') {
      projectData.heroImageId = null;
    }

    const project = await prisma.project.create({
      data: {
        ...projectData,
        status: data.status || 'DRAFT',
        technologies: technologyIds?.length
          ? {
              create: (technologyIds as string[]).map((techId: string) => ({ technologyId: techId })),
            }
          : undefined,
        caseStudy: caseStudy
          ? {
              create: {
                summary: caseStudy.summary || '',
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
        summary?: string;
        metrics?: any;
        testimonial?: any;
      } | null;
      userId?: string;
    }>
  ) {
    let existing = await prisma.project.findFirst({ where: { id, deletedAt: null } });
    if (!existing && data.slug) {
      existing = await prisma.project.findFirst({ where: { slug: data.slug, deletedAt: null } });
    }
    if (!existing) {
      const seedProj = INITIAL_SEED_DATA.projects.find((p) => p.id === id || (data.slug && p.slug === data.slug));
      if (seedProj) {
        return this.create({
          ...(seedProj as any),
          ...data,
          slug: data.slug || seedProj.slug,
          title: data.title || seedProj.title,
          categoryId: data.categoryId || seedProj.categoryId,
        });
      }
      throw new Error(`Project with ID "${id}" not found`);
    }

    if (data.slug && data.slug !== existing.slug) {
      const duplicate = await prisma.project.findUnique({ where: { slug: data.slug } });
      if (duplicate && duplicate.id !== id) {
        throw new Error(`A project with slug "${data.slug}" already exists`);
      }
    }

    const { technologyIds, caseStudy, userId, uxApproach, uiApproach, ...updateData } = data as any;
    if (updateData.heroImageId === '') {
      updateData.heroImageId = null;
    }

    // Handle technology relation re-linking if technologyIds provided
    if (technologyIds !== undefined) {
      await prisma.projectTechnology.deleteMany({ where: { projectId: id } });
      if (technologyIds.length > 0) {
        await prisma.projectTechnology.createMany({
          data: (technologyIds as string[]).map((tId: string) => ({ projectId: id, technologyId: tId })),
        });
      }
    }

    // Handle case study update
    if (caseStudy) {
      await prisma.caseStudy.upsert({
        where: { projectId: id },
        create: {
          projectId: id,
          summary: caseStudy.summary || '',
          metrics: caseStudy.metrics,
          testimonial: caseStudy.testimonial,
          status: data.status || existing.status,
        },
        update: {
          summary: caseStudy.summary || undefined,
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

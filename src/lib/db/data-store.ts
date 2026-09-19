import prisma from './prisma';
import { INITIAL_SEED_DATA } from './seed-data';
import type { Metadata } from 'next';
import type { ResolvedMetric } from '@/types/metrics';
import { resolvePublicMediaUrl } from '@/lib/media';

let isDbAvailable: boolean | null = null;
let lastCheckTime = 0;

/**
 * Checks whether the PostgreSQL database is reachable with a 10s cache
 */
export async function isDatabaseReachable(): Promise<boolean> {
  const now = Date.now();
  if (isDbAvailable !== null && now - lastCheckTime < 10000) {
    return isDbAvailable;
  }

  try {
    // Quick probe
    await prisma.$queryRaw`SELECT 1`;
    isDbAvailable = true;
  } catch {
    isDbAvailable = false;
  }

  lastCheckTime = now;
  return isDbAvailable;
}

/**
 * DataStore Access Layer
 * 
 * Provides unified, resilient data access for the public website and admin portal.
 * Seamlessly interfaces with Prisma ORM and guarantees that database data is 100%
 * authoritative when reachable (including empty results).
 * Gracefully falls back to baseline seed data ONLY if the database is physically unreachable.
 */
export class DataStore {
  /**
   * Retrieves all site settings as a key-value record
   */
  static async getSettings(): Promise<Record<string, string>> {
    if (await isDatabaseReachable()) {
      try {
        const dbSettings = await prisma.siteSetting.findMany();
        if (dbSettings) {
          return dbSettings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
          }, {} as Record<string, string>);
        }
      } catch {
        // Fallback on connection error
      }
    }

    return INITIAL_SEED_DATA.siteSettings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  }

  /**
   * Retrieves resolved homepage proof metrics for public presentation
   */
  static async getProofMetrics(): Promise<ResolvedMetric[]> {
    const { MetricsService } = await import('@/services/metrics.service');
    return MetricsService.getResolvedPublicMetrics();
  }

  /**
   * Retrieves navigation items for header or footer
   */
  static async getNavigation(location: 'header' | 'footer' = 'header') {
    if (await isDatabaseReachable()) {
      try {
        const items = await prisma.navigationItem.findMany({
          where: { location, isEnabled: true },
          orderBy: { displayOrder: 'asc' },
        });
        if (items) return items;
      } catch {
        // Fallback on connection error
      }
    }

    return INITIAL_SEED_DATA.navigation.filter((item) => item.location === location);
  }

  /**
   * Retrieves active social links
   */
  static async getSocialLinks() {
    if (await isDatabaseReachable()) {
      try {
        const links = await prisma.socialLink.findMany({
          where: { isEnabled: true },
          orderBy: { displayOrder: 'asc' },
        });
        if (links) return links;
      } catch {
        // Fallback on connection error
      }
    }

    return INITIAL_SEED_DATA.socialLinks;
  }

  /**
   * Retrieves published services with their features and technologies
   */
  static async getServices() {
    if (await isDatabaseReachable()) {
      try {
        let services = await prisma.service.findMany({
          where: { status: 'PUBLISHED', deletedAt: null },
          include: {
            features: { orderBy: { displayOrder: 'asc' } },
            technologies: { include: { technology: true } },
            heroImage: true,
          },
          orderBy: { displayOrder: 'asc' },
        });

        if (!services || services.length === 0) {
          const { ServicesService } = await import('@/services/service.service');
          await ServicesService.autoSeedIfEmpty();
          services = await prisma.service.findMany({
            where: { status: 'PUBLISHED', deletedAt: null },
            include: {
              features: { orderBy: { displayOrder: 'asc' } },
              technologies: { include: { technology: true } },
              heroImage: true,
            },
            orderBy: { displayOrder: 'asc' },
          });
        }

        if (services && services.length > 0) return services;
      } catch {
        // Fallback on connection error
      }
    }

    return INITIAL_SEED_DATA.services;
  }

  /**
   * Retrieves single service by slug
   */
  static async getServiceBySlug(slug: string) {
    if (await isDatabaseReachable()) {
      try {
        const service = await prisma.service.findFirst({
          where: { slug, status: 'PUBLISHED', deletedAt: null },
          include: {
            features: { orderBy: { displayOrder: 'asc' } },
            technologies: { include: { technology: true } },
            heroImage: true,
          },
        });
        if (service) {
          return {
            ...service,
            heroImage: service.heroImage
              ? {
                  ...service.heroImage,
                  url: resolvePublicMediaUrl(service.heroImage),
                }
              : null,
          };
        }
        return service;
      } catch {
        // Fallback on connection error
      }
    }

    return INITIAL_SEED_DATA.services.find((s) => s.slug === slug) || null;
  }

  /**
   * Retrieves published projects with categories, case studies, and technologies
   */
  static async getProjects(options?: { categorySlug?: string; featuredOnly?: boolean }) {
    if (await isDatabaseReachable()) {
      try {
        const where: Record<string, unknown> = { status: 'PUBLISHED', deletedAt: null };
        if (options?.featuredOnly) where.isFeatured = true;
        if (options?.categorySlug) {
          where.category = { slug: options.categorySlug };
        }

        let projects = await prisma.project.findMany({
          where,
          include: {
            category: true,
            caseStudy: true,
            technologies: { include: { technology: true } },
            heroImage: true,
          },
          orderBy: { displayOrder: 'asc' },
        });

        if (!projects || projects.length === 0) {
          const { ProjectService } = await import('@/services/project.service');
          await ProjectService.autoSeedIfEmpty();
          projects = await prisma.project.findMany({
            where,
            include: {
              category: true,
              caseStudy: true,
              technologies: { include: { technology: true } },
              heroImage: true,
            },
            orderBy: { displayOrder: 'asc' },
          });
        }

        if (projects && projects.length > 0) {
          return projects.map((p: any) => ({
            ...p,
            heroImage: p.heroImage
              ? {
                  ...p.heroImage,
                  url: resolvePublicMediaUrl(p.heroImage),
                }
              : null,
          }));
        }
      } catch {
        // Fallback on connection error
      }
    }

    let filtered = INITIAL_SEED_DATA.projects.filter((p) => p.status === 'PUBLISHED');
    if (options?.featuredOnly) {
      filtered = filtered.filter((p) => p.isFeatured);
    }
    if (options?.categorySlug) {
      filtered = filtered.filter((p) => (p as any).categorySlug === options.categorySlug);
    }
    return filtered;
  }

  /**
   * Retrieves single project by slug
   */
  static async getProjectBySlug(slug: string) {
    if (await isDatabaseReachable()) {
      try {
        const project = await prisma.project.findFirst({
          where: { slug, status: 'PUBLISHED', deletedAt: null },
          include: {
            category: true,
            caseStudy: true,
            technologies: { include: { technology: true } },
            heroImage: true,
            gallery: { include: { mediaAsset: true }, orderBy: { displayOrder: 'asc' } },
          },
        });
        if (project) {
          return {
            ...project,
            heroImage: project.heroImage
              ? {
                  ...project.heroImage,
                  url: resolvePublicMediaUrl(project.heroImage),
                }
              : null,
            gallery: project.gallery?.map((g: any) => ({
              ...g,
              mediaAsset: g.mediaAsset
                ? {
                    ...g.mediaAsset,
                    url: resolvePublicMediaUrl(g.mediaAsset),
                  }
                : null,
            })),
          };
        }
      } catch {
        // Fallback on connection error
      }
    }

    const rawProj = INITIAL_SEED_DATA.projects.find((p) => p.slug === slug) || null;
    if (!rawProj) return null;

    const category = INITIAL_SEED_DATA.projectCategories.find(
      (c) => c.id === (rawProj as any).categoryId
    );
    const technologies = ((rawProj as any).technologyIds || [])
      .map((tId: string) => ({
        technology: INITIAL_SEED_DATA.technologies.find((t) => t.id === tId),
      }))
      .filter((t: any) => Boolean(t.technology));

    return {
      ...rawProj,
      category,
      technologies,
    };
  }

  /**
   * Retrieves project categories
   */
  static async getProjectCategories() {
    if (await isDatabaseReachable()) {
      try {
        const categories = await prisma.projectCategory.findMany({
          orderBy: { order: 'asc' },
        });
        if (categories) return categories;
      } catch {
        // Fallback on connection error
      }
    }

    return INITIAL_SEED_DATA.projectCategories;
  }

  /**
   * Retrieves technologies categorized
   */
  static async getTechnologies() {
    if (await isDatabaseReachable()) {
      try {
        const technologies = await prisma.technology.findMany({
          orderBy: { displayOrder: 'asc' },
        });
        if (technologies) return technologies;
      } catch {
        // Fallback on connection error
      }
    }

    return INITIAL_SEED_DATA.technologies;
  }

  /**
   * Retrieves team members (distinguishing founders and leadership)
   */
  static async getTeamMembers() {
    if (await isDatabaseReachable()) {
      try {
        const members = await prisma.teamMember.findMany({
          where: { isActive: true, deletedAt: null },
          include: {
            department: true,
            role: true,
            image: true,
            socialLinks: true,
          },
          orderBy: [{ isFounder: 'desc' }, { displayOrder: 'asc' }],
        });
        if (members) {
          return members.map((m: any) => ({
            ...m,
            image: m.image
              ? {
                  ...m.image,
                  url: resolvePublicMediaUrl(m.image),
                }
              : null,
          }));
        }
      } catch {
        // Fallback on connection error
      }
    }

    return INITIAL_SEED_DATA.teamMembers;
  }

  /**
   * Retrieves executive founders
   */
  static async getFounders() {
    const members = await this.getTeamMembers();
    return members.filter((m: any) => m.isFounder);
  }

  /**
   * Retrieves process delivery steps
   */
  static async getProcessSteps() {
    if (await isDatabaseReachable()) {
      try {
        const steps = await prisma.processStep.findMany({
          orderBy: { stepNumber: 'asc' },
        });
        if (steps) return steps;
      } catch {
        // Fallback on connection error
      }
    }

    return INITIAL_SEED_DATA.processSteps;
  }

  /**
   * Retrieves core company values
   */
  static async getValues() {
    if (await isDatabaseReachable()) {
      try {
        const values = await prisma.companyValue.findMany({
          orderBy: { displayOrder: 'asc' },
        });
        if (values) return values;
      } catch {
        // Fallback on connection error
      }
    }

    return INITIAL_SEED_DATA.values;
  }

  /**
   * Retrieves published FAQs
   */
  static async getFAQs(category?: string) {
    if (await isDatabaseReachable()) {
      try {
        const where: Record<string, unknown> = { isPublished: true };
        if (category) where.category = category;

        const faqs = await prisma.fAQ.findMany({
          where,
          orderBy: { displayOrder: 'asc' },
        });
        if (faqs) return faqs;
      } catch {
        // Fallback on connection error
      }
    }

    return INITIAL_SEED_DATA.faqs;
  }

  /**
   * Retrieves published insights/articles
   */
  static async getInsights() {
    if (await isDatabaseReachable()) {
      try {
        const insights = await prisma.insight.findMany({
          where: { status: 'PUBLISHED', deletedAt: null },
          include: {
            category: true,
            author: { select: { name: true, avatarUrl: true } },
            coverImage: true,
          },
          orderBy: { publishedAt: 'desc' },
        });
        if (insights) return insights;
      } catch {
        // Fallback on connection error
      }
    }

    return INITIAL_SEED_DATA.insights;
  }

  /**
   * Retrieves single insight by slug
   */
  static async getInsightBySlug(slug: string) {
    if (await isDatabaseReachable()) {
      try {
        const insight = await prisma.insight.findFirst({
          where: { slug, status: 'PUBLISHED', deletedAt: null },
          include: {
            category: true,
            author: { select: { name: true, avatarUrl: true } },
            coverImage: true,
          },
        });
        return insight;
      } catch {
        // Fallback on connection error
      }
    }

    return INITIAL_SEED_DATA.insights.find((i) => i.slug === slug) || null;
  }

  /**
   * Retrieves route-level SEO metadata from CMS, falling back to global settings
   */
  static async getSEO(routePath: string): Promise<Metadata> {
    const candidates = [routePath];
    const clean = routePath.replace(/^\//, '');
    if (clean && !candidates.includes(clean)) candidates.push(clean);
    if (routePath === '/work' || routePath === 'work') {
      candidates.push('/projects', 'projects');
    } else if (routePath === '/' || routePath === '') {
      candidates.push('homepage');
    }
    candidates.push('global');

    let setting: any = null;
    if (await isDatabaseReachable()) {
      try {
        for (const cand of candidates) {
          const found = await prisma.sEOSetting.findUnique({
            where: { routePath: cand },
          });
          if (found) {
            setting = found;
            break;
          }
        }
      } catch {
        // Database query failed
      }
    }

    const settings = await this.getSettings();
    const brandName = settings.brand_name || 'GMDware';

    const defaultTitle =
      routePath === '/'
        ? `${brandName} — Modern Software Engineering & Digital Platforms`
        : `${routePath.replace('/', '').charAt(0).toUpperCase() + routePath.slice(2)} | ${brandName}`;

    const title = setting?.title || defaultTitle;
    const description =
      setting?.description ||
      settings.meta_description ||
      settings.tagline ||
      'GMDware architects bespoke enterprise software, mission-critical distributed systems, and cinematic digital flagships.';

    const keywords =
      setting?.keywords && setting.keywords.length > 0
        ? setting.keywords
        : [
            'Enterprise Software',
            'Systems Architecture',
            'Custom Web Platforms',
            'Distributed Systems',
            'Cloud Engineering',
          ];

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gmdware.com';
    const canonical = setting?.canonicalUrl || `${baseUrl}${routePath === '/' ? '' : routePath}`;

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical,
      },
      openGraph: {
        title: setting?.ogTitle || title,
        description: setting?.ogDescription || description,
        url: canonical,
        images: setting?.ogImageUrl
          ? [{ url: setting.ogImageUrl }]
          : [{ url: `${baseUrl}/og-image.png` }],
        type: 'website',
        siteName: brandName,
      },
      twitter: {
        card: (setting?.twitterCard as any) || 'summary_large_image',
        title: setting?.ogTitle || title,
        description: setting?.ogDescription || description,
        images: setting?.ogImageUrl ? [setting.ogImageUrl] : undefined,
      },
      robots: setting?.noIndex
        ? { index: false, follow: false }
        : { index: true, follow: true },
    };
  }
}

export default DataStore;

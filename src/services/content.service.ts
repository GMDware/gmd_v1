import prisma from '@/lib/db/prisma';
import { PublicationStatus } from '@prisma/client';
import DataStore, { isDatabaseReachable } from '@/lib/db/data-store';
import { AuthService } from './auth.service';

export class ContentService {
  // ---------------------------------------------------------------------------
  // PROCESS STEPS
  // ---------------------------------------------------------------------------
  static async listProcessSteps() {
    return prisma.processStep.findMany({ orderBy: { stepNumber: 'asc' } });
  }

  static async upsertProcessStep(data: {
    stepNumber: number;
    title: string;
    phase: string;
    description: string;
    deliverables: string[];
    iconName?: string;
  }) {
    return prisma.processStep.upsert({
      where: { stepNumber: data.stepNumber },
      create: data,
      update: data,
    });
  }

  static async deleteProcessStep(id: string) {
    return prisma.processStep.delete({ where: { id } });
  }

  static async updateProcessStep(
    id: string,
    data: Partial<{
      stepNumber: number;
      title: string;
      phase: string;
      description: string;
      deliverables: string[];
      iconName?: string;
    }>
  ) {
    return prisma.processStep.update({ where: { id }, data });
  }

  // ---------------------------------------------------------------------------
  // VALUES
  // ---------------------------------------------------------------------------
  static async listValues() {
    return prisma.companyValue.findMany({ orderBy: { displayOrder: 'asc' } });
  }

  static async createValue(data: { title: string; summary: string; displayOrder?: number; iconName?: string }) {
    return prisma.companyValue.create({ data });
  }

  static async updateValue(id: string, data: Partial<{ title: string; summary: string; displayOrder: number; iconName?: string }>) {
    return prisma.companyValue.update({ where: { id }, data });
  }

  static async deleteValue(id: string) {
    return prisma.companyValue.delete({ where: { id } });
  }

  // ---------------------------------------------------------------------------
  // FAQS
  // ---------------------------------------------------------------------------
  static async listFAQs(options: { category?: string; isPublished?: boolean } = {}) {
    const where: Record<string, any> = {};
    if (options.category) where.category = options.category;
    if (options.isPublished !== undefined) where.isPublished = options.isPublished;
    return prisma.fAQ.findMany({ where, orderBy: { displayOrder: 'asc' } });
  }

  static async createFAQ(data: { question: string; answer: string; category: string; displayOrder?: number; isPublished?: boolean }) {
    return prisma.fAQ.create({ data });
  }

  static async updateFAQ(id: string, data: Partial<{ question: string; answer: string; category: string; displayOrder: number; isPublished: boolean }>) {
    return prisma.fAQ.update({ where: { id }, data });
  }

  static async deleteFAQ(id: string) {
    return prisma.fAQ.delete({ where: { id } });
  }

  // ---------------------------------------------------------------------------
  // INSIGHTS
  // ---------------------------------------------------------------------------
  static async listInsights(options: { status?: PublicationStatus; categoryId?: string } = {}) {
    const where: Record<string, any> = { deletedAt: null };
    if (options.status) where.status = options.status;
    if (options.categoryId) where.categoryId = options.categoryId;

    return prisma.insight.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      include: {
        category: true,
        author: { select: { name: true, avatarUrl: true } },
        coverImage: true,
      },
    });
  }

  static async createInsight(data: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    categoryId: string;
    authorId: string;
    coverImageId?: string | null;
    readTimeMin?: number;
    tags?: string[];
    status?: PublicationStatus;
    isFeatured?: boolean;
    publishedAt?: Date;
  }) {
    const existing = await prisma.insight.findUnique({ where: { slug: data.slug } });
    if (existing) {
      throw new Error(`An insight with slug "${data.slug}" already exists`);
    }
    return prisma.insight.create({ data });
  }

  // ---------------------------------------------------------------------------
  // SITE SETTINGS
  // ---------------------------------------------------------------------------
  static async getSettings() {
    const records = await prisma.siteSetting.findMany();
    return records.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  }

  static async updateSetting(key: string, value: string, group = 'general', userId?: string) {
    const setting = await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value, group },
      update: { value, group },
    });

    if (userId) {
      await AuthService.logAudit({
        userId,
        action: 'UPDATE_SETTING',
        entity: 'SiteSetting',
        entityId: key,
        metadata: { key, value },
      });
    }

    return setting;
  }

  static async batchUpdateSettings(settings: Record<string, string>, group = 'general', userId?: string) {
    const operations = Object.entries(settings).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        create: { key, value, group },
        update: { value, group },
      })
    );

    const results = await prisma.$transaction(operations);

    if (userId) {
      await AuthService.logAudit({
        userId,
        action: 'BATCH_UPDATE_SETTINGS',
        entity: 'SiteSetting',
        entityId: group,
        metadata: settings,
      });
    }

    return results;
  }

  // ---------------------------------------------------------------------------
  // SEO SETTINGS
  // ---------------------------------------------------------------------------
  static async listSEOSettings() {
    return prisma.sEOSetting.findMany();
  }

  static async getSEOSetting(routePath = '/') {
    return prisma.sEOSetting.findUnique({ where: { routePath } });
  }

  static async upsertSEOSetting(data: {
    routePath: string;
    title: string;
    description: string;
    keywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImageUrl?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
    userId?: string;
  }) {
    const { userId, ...seoData } = data;
    const setting = await prisma.sEOSetting.upsert({
      where: { routePath: data.routePath },
      create: {
        ...seoData,
        keywords: seoData.keywords || [],
      },
      update: {
        ...seoData,
        keywords: seoData.keywords || [],
      },
    });

    if (userId) {
      await AuthService.logAudit({
        userId,
        action: 'UPSERT_SEO',
        entity: 'SEOSetting',
        entityId: data.routePath,
        metadata: seoData,
      });
    }

    return setting;
  }

  // ---------------------------------------------------------------------------
  // NAVIGATION
  // ---------------------------------------------------------------------------
  static async listNavigation(location?: string) {
    const where: Record<string, any> = {};
    if (location) where.location = location;
    return prisma.navigationItem.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });
  }

  static async createNavigationItem(data: {
    label: string;
    path: string;
    location?: string;
    displayOrder?: number;
    isExternal?: boolean;
    isEnabled?: boolean;
    parentId?: string;
  }) {
    return prisma.navigationItem.create({ data });
  }

  static async updateNavigationItem(
    id: string,
    data: Partial<{
      label: string;
      path: string;
      location: string;
      displayOrder: number;
      isExternal: boolean;
      isEnabled: boolean;
    }>
  ) {
    return prisma.navigationItem.update({ where: { id }, data });
  }

  static async deleteNavigationItem(id: string) {
    return prisma.navigationItem.delete({ where: { id } });
  }

  // ---------------------------------------------------------------------------
  // SOCIAL LINKS
  // ---------------------------------------------------------------------------
  static async listSocialLinks(onlyEnabled: boolean = true) {
    if (await isDatabaseReachable()) {
      try {
        return await prisma.socialLink.findMany({
          where: onlyEnabled ? { isEnabled: true } : undefined,
          orderBy: { displayOrder: 'asc' },
        });
      } catch {
        // Fall through to DataStore fallback
      }
    }
    const links = await DataStore.getSocialLinks();
    return onlyEnabled ? links.filter((l: any) => l.isEnabled !== false) : links;
  }

  static async createSocialLink(data: { platform: string; url: string; displayOrder?: number; isEnabled?: boolean }) {
    return prisma.socialLink.create({ data });
  }

  static async updateSocialLink(
    id: string,
    data: Partial<{ platform: string; url: string; displayOrder: number; isEnabled: boolean }>
  ) {
    return prisma.socialLink.update({ where: { id }, data });
  }

  static async deleteSocialLink(id: string) {
    return prisma.socialLink.delete({ where: { id } });
  }
}

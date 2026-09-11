import prisma from '@/lib/db/prisma';
import { ContactStatus } from '@prisma/client';
import { isDatabaseReachable } from '@/lib/db/data-store';
import { AuthService } from './auth.service';

const fallbackSubmissions: any[] = [];

export class ContactService {
  /**
   * Submit an inbound contact inquiry (Public endpoint)
   */
  static async submit(data: {
    fullName: string;
    email: string;
    phone?: string | null;
    companyName?: string;
    projectType?: string;
    budgetRange?: string;
    timeline?: string;
    message: string;
    ipAddress?: string;
    userAgent?: string;
    intakeRoute?: string;
    routingTag?: string;
  }) {
    const isDiscoveryRoute =
      data.intakeRoute === 'SCOPED_DISCOVERY_CALL' ||
      (data.budgetRange &&
        (data.budgetRange.includes('< $5,000') ||
          data.budgetRange.toLowerCase().includes('flexible')));

    const initialNotes = isDiscoveryRoute
      ? '[Pipeline Route: Scoped Discovery Call] Prioritized for exploratory architectural discovery session (MVP / Flexible Scope).'
      : undefined;

    if (await isDatabaseReachable()) {
      try {
        return await prisma.contactSubmission.create({
          data: {
            fullName: data.fullName.trim(),
            email: data.email.toLowerCase().trim(),
            phone: data.phone?.trim() || null,
            companyName: data.companyName?.trim(),
            projectType: data.projectType?.trim(),
            budgetRange: data.budgetRange?.trim(),
            timeline: data.timeline?.trim(),
            message: data.message.trim(),
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
            status: 'NEW',
            notes: initialNotes,
          },
        });
      } catch {
        // Fall through to in-memory fallback if write fails
      }
    }

    const submission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      fullName: data.fullName.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone?.trim() || null,
      companyName: data.companyName?.trim(),
      projectType: data.projectType?.trim(),
      budgetRange: data.budgetRange?.trim(),
      timeline: data.timeline?.trim(),
      message: data.message.trim(),
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      status: 'NEW' as ContactStatus,
      notes: initialNotes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    fallbackSubmissions.unshift(submission);
    return submission;
  }

  /**
   * List contact submissions (Protected Admin only)
   */
  static async list(options: { status?: ContactStatus; page?: number; limit?: number } = {}) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 50));
    const skip = (page - 1) * limit;

    if (await isDatabaseReachable()) {
      try {
        const where: Record<string, any> = {};
        if (options.status) {
          where.status = options.status;
        }

        const [total, items] = await Promise.all([
          prisma.contactSubmission.count({ where }),
          prisma.contactSubmission.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
          }),
        ]);

        const mappedItems = items.map((item) => ({
          ...item,
          name: item.fullName,
          company: item.companyName,
          adminNotes: item.notes,
        }));

        return {
          items: mappedItems,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        };
      } catch {
        // Fall through to in-memory fallback
      }
    }

    const filtered = options.status
      ? fallbackSubmissions.filter((s) => s.status === options.status)
      : fallbackSubmissions;
    const total = filtered.length;
    const items = filtered.slice(skip, skip + limit).map((item) => ({
      ...item,
      name: item.fullName,
      company: item.companyName,
      adminNotes: item.notes,
    }));

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Get single inquiry by ID
   */
  static async getById(id: string) {
    if (await isDatabaseReachable()) {
      try {
        const item = await prisma.contactSubmission.findUnique({ where: { id } });
        if (item) {
          return {
            ...item,
            name: item.fullName,
            company: item.companyName,
            adminNotes: item.notes,
          };
        }
      } catch {
        // Fall through to fallbackSubmissions
      }
    }

    const fallback = fallbackSubmissions.find((s) => s.id === id);
    if (!fallback) return null;
    return {
      ...fallback,
      name: fallback.fullName,
      company: fallback.companyName,
      adminNotes: fallback.notes,
    };
  }

  /**
   * Update inquiry triage status and notes
   */
  static async updateStatus(
    id: string,
    status: ContactStatus,
    notes?: string,
    userId?: string
  ) {
    if (await isDatabaseReachable()) {
      try {
        const updated = await prisma.contactSubmission.update({
          where: { id },
          data: {
            status,
            ...(notes !== undefined ? { notes } : {}),
          },
        });

        if (userId) {
          await AuthService.logAudit({
            userId,
            action: 'UPDATE_INQUIRY_STATUS',
            entity: 'ContactSubmission',
            entityId: id,
            metadata: { status, notes },
          });
        }

        return updated;
      } catch {
        // Fall through to fallback
      }
    }

    const item = fallbackSubmissions.find((s) => s.id === id);
    if (item) {
      item.status = status;
      if (notes !== undefined) item.notes = notes;
      item.updatedAt = new Date();
      return item;
    }

    return null;
  }

  /**
   * Delete inquiry
   */
  static async delete(id: string, userId?: string) {
    if (await isDatabaseReachable()) {
      try {
        const deleted = await prisma.contactSubmission.delete({ where: { id } });

        if (userId) {
          await AuthService.logAudit({
            userId,
            action: 'DELETE_INQUIRY',
            entity: 'ContactSubmission',
            entityId: id,
            metadata: { email: deleted.email },
          });
        }

        return deleted;
      } catch {
        // Fall through to fallback
      }
    }

    const index = fallbackSubmissions.findIndex((s) => s.id === id);
    if (index !== -1) {
      const [removed] = fallbackSubmissions.splice(index, 1);
      return removed;
    }

    return null;
  }
}

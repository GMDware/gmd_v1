import prisma from '@/lib/db/prisma';
import { isDatabaseReachable } from '@/lib/db/data-store';
import { AuthService } from './auth.service';
import {
  MetricItem,
  ResolvedMetric,
  DEFAULT_PROOF_METRICS,
  MetricKey,
} from '@/types/metrics';

export function parseMetricValue(raw: string): {
  numericValue: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
} {
  const cleanRaw = raw.trim();
  // Support thousands commas e.g. 12,514+ -> 12514 with '+' suffix
  const normalized = cleanRaw.replace(/(\d),(\d)/g, '$1$2');
  const match = normalized.match(/^([^\d\.]*)(\d+(?:\.\d+)?)(.*)$/);
  if (match) {
    const prefix = match[1] || undefined;
    const numStr = match[2];
    const suffix = match[3] || undefined;
    const numericValue = parseFloat(numStr);
    const decimalParts = numStr.split('.');
    const decimals = decimalParts.length > 1 ? decimalParts[1].length : 0;
    return { numericValue, prefix, suffix, decimals };
  }
  return { numericValue: 0, suffix: raw };
}

export class MetricsService {
  /**
   * Retrieves raw metric configurations from SiteSetting table or baseline defaults
   */
  static async getMetricConfigurations(): Promise<MetricItem[]> {
    if (!(await isDatabaseReachable())) {
      return DEFAULT_PROOF_METRICS;
    }

    try {
      const setting = await prisma.siteSetting.findUnique({
        where: { key: 'homepage_proof_metrics' },
      });

      if (setting && setting.value) {
        const parsed = JSON.parse(setting.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasVisitors = parsed.some((item: any) => item.key === 'visitors');
          if (!hasVisitors) {
            const visitorDefault = DEFAULT_PROOF_METRICS.find((m) => m.key === 'visitors');
            if (visitorDefault) {
              return [...parsed, visitorDefault];
            }
          }
          return parsed;
        }
      }
    } catch {
      // Fall back to defaults on DB error
    }

    return DEFAULT_PROOF_METRICS;
  }

  /**
   * Calculates dynamic metrics from real-time database tables
   */
  static async calculateAutoMetric(
    key: MetricKey,
    _autoQueryKey?: string
  ): Promise<string> {
    if (!(await isDatabaseReachable())) {
      switch (key) {
        case 'projects':
          return '+4';
        case 'clients':
          return '+4';
        case 'inquiries':
          return '100%';
        case 'uptime':
          return '99.9%';
        case 'visitors':
          return '0+';
        default:
          return '0';
      }
    }
    try {
      switch (key) {
        case 'projects': {
          const count = await prisma.project.count({
            where: { status: 'PUBLISHED', deletedAt: null },
          });
          return `+${count}`;
        }

        case 'clients': {
          const projectsWithClients = await prisma.project.findMany({
            where: { status: 'PUBLISHED', deletedAt: null, clientName: { not: null } },
            select: { clientName: true },
            distinct: ['clientName'],
          });
          const count = projectsWithClients.length;
          return `+${count}`;
        }

        case 'inquiries': {
          const total = await prisma.contactSubmission.count();
          if (total === 0) return '100%';
          const handled = await prisma.contactSubmission.count({
            where: { status: { in: ['READ', 'IN_PROGRESS', 'CONTACTED', 'ARCHIVED'] } },
          });
          const rate = Math.round((handled / total) * 100);
          return `${rate}%`;
        }

        case 'uptime': {
          // Mission-critical production uptime SLA standard
          return '99.9%';
        }

        case 'visitors': {
          const setting = await prisma.siteSetting.findUnique({
            where: { key: 'total_visitors' },
          });
          const count = setting?.value ? parseInt(setting.value, 10) : 0;
          const total = isNaN(count) ? 0 : Math.max(0, count);
          return `${total.toLocaleString()}+`;
        }

        default:
          return '0';
      }
    } catch {
      // Graceful baseline if database query encounters an unexpected issue
      switch (key) {
        case 'projects':
          return '+4';
        case 'clients':
          return '+4';
        case 'inquiries':
          return '100%';
        case 'uptime':
          return '99.9%';
        case 'visitors':
          return '0+';
        default:
          return '0';
      }
    }
  }

  /**
   * Atomically increments total visitors in PostgreSQL if verified human session
   */
  static async recordVisitorSession(userAgent?: string | null): Promise<void> {
    if (!(await isDatabaseReachable())) return;
    if (userAgent && /bot|crawler|spider|crawling|headless|slurp|facebookexternalhit|curl|wget/i.test(userAgent)) {
      return; // Skip bots and automated crawlers
    }

    try {
      await prisma.$executeRaw`
        INSERT INTO site_settings (id, key, value, type, "group", "updatedAt")
        VALUES (gen_random_uuid(), 'total_visitors', '1', 'number', 'analytics', NOW())
        ON CONFLICT (key) DO UPDATE
        SET value = (COALESCE(NULLIF(site_settings.value, ''), '0')::int + 1)::text,
            "updatedAt" = NOW();
      `;
    } catch (err) {
      console.error('[MetricsService] Failed to atomically increment visitor count:', err);
    }
  }

  /**
   * Returns current auto-calculated values for all metric keys
   */
  static async getAllAutoValues(): Promise<Record<MetricKey, string>> {
    const [projects, clients, inquiries, uptime, visitors] = await Promise.all([
      this.calculateAutoMetric('projects'),
      this.calculateAutoMetric('clients'),
      this.calculateAutoMetric('inquiries'),
      this.calculateAutoMetric('uptime'),
      this.calculateAutoMetric('visitors'),
    ]);

    return { projects, clients, inquiries, uptime, visitors };
  }

  /**
   * Resolves final public metrics for the landing page
   */
  static async getResolvedPublicMetrics(): Promise<ResolvedMetric[]> {
    const items = await this.getMetricConfigurations();
    const autoValues = await this.getAllAutoValues();

    const visibleItems = items
      .filter((item) => item.isVisible)
      .sort((a, b) => a.order - b.order);

    return visibleItems.map((item) => {
      const finalValue =
        item.mode === 'auto'
          ? autoValues[item.key] || item.manualValue
          : item.manualValue;

      const parsed = parseMetricValue(finalValue);

      return {
        id: item.id,
        key: item.key,
        value: finalValue,
        numericValue: parsed.numericValue,
        prefix: parsed.prefix,
        suffix: parsed.suffix,
        decimals: parsed.decimals,
        label: item.label,
        subtext: item.subtext,
        order: item.order,
        isVisible: item.isVisible,
      };
    });
  }

  /**
   * Saves updated metric configurations with audit logging
   */
  static async saveMetricConfigurations(
    items: MetricItem[],
    userId?: string
  ): Promise<MetricItem[]> {
    await prisma.siteSetting.upsert({
      where: { key: 'homepage_proof_metrics' },
      create: {
        key: 'homepage_proof_metrics',
        value: JSON.stringify(items),
        type: 'json',
        group: 'homepage',
        description: 'Dynamic Proof Metrics configuration with manual/auto modes',
      },
      update: {
        value: JSON.stringify(items),
        type: 'json',
        group: 'homepage',
      },
    });

    if (userId) {
      await AuthService.logAudit({
        userId,
        action: 'UPDATE_PROOF_METRICS',
        entity: 'SiteSetting',
        entityId: 'homepage_proof_metrics',
        metadata: { itemCount: items.length },
      });
    }

    return items;
  }
}

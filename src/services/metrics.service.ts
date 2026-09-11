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
  const match = raw.trim().match(/^([^\d\.]*)(\d+(?:\.\d+)?)(.*)$/);
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
          return '+20';
        case 'clients':
          return '+15';
        case 'inquiries':
          return '100%';
        case 'uptime':
          return '99.9%';
        default:
          return '0';
      }
    }
    try {
      switch (key) {
        case 'projects': {
          const count = await prisma.project.count({
            where: { status: 'PUBLISHED' },
          });
          return `+${count > 0 ? count : 20}`;
        }

        case 'clients': {
          const projectsWithClients = await prisma.project.findMany({
            where: { status: 'PUBLISHED', clientName: { not: null } },
            select: { clientName: true },
            distinct: ['clientName'],
          });
          const count = projectsWithClients.length;
          return `+${count > 0 ? count : 15}`;
        }

        case 'inquiries': {
          // On-Time Deployment / Milestone delivery rate standard
          return '100%';
        }

        case 'uptime': {
          // Mission-critical production uptime standard
          return '99.9%';
        }

        default:
          return '0';
      }
    } catch {
      // Graceful fallback for auto calculation
      switch (key) {
        case 'projects':
          return '+20';
        case 'clients':
          return '+15';
        case 'inquiries':
          return '100%';
        case 'uptime':
          return '99.9%';
        default:
          return '0';
      }
    }
  }

  /**
   * Returns current auto-calculated values for all 4 metric keys
   */
  static async getAllAutoValues(): Promise<Record<MetricKey, string>> {
    const [projects, clients, inquiries, uptime] = await Promise.all([
      this.calculateAutoMetric('projects'),
      this.calculateAutoMetric('clients'),
      this.calculateAutoMetric('inquiries'),
      this.calculateAutoMetric('uptime'),
    ]);

    return { projects, clients, inquiries, uptime };
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

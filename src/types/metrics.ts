export type MetricKey = 'projects' | 'clients' | 'inquiries' | 'uptime';
export type MetricMode = 'manual' | 'auto';

export interface MetricItem {
  id: string;
  key: MetricKey;
  mode: MetricMode;             // Toggle between manual override and calculated stats
  manualValue: string;          // e.g., "+20", "100%", "< 2h"
  autoQueryKey?: string;        // Refers to DB counts (e.g., count of completed projects)
  label: string;                // e.g., "DELIVERED SOLUTIONS"
  subtext: string;              // e.g., "Production Systems Launched"
  order: number;
  isVisible: boolean;
}

export interface ResolvedMetric {
  id: string;
  key: MetricKey;
  value: string;
  numericValue: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  subtext: string;
  order: number;
  isVisible: boolean;
}

export const DEFAULT_PROOF_METRICS: MetricItem[] = [
  {
    id: 'delivered-solutions',
    key: 'projects',
    mode: 'manual',
    manualValue: '+20',
    autoQueryKey: 'published_projects',
    label: 'DELIVERED SOLUTIONS',
    subtext: 'Production Systems Launched',
    order: 1,
    isVisible: true,
  },
  {
    id: 'on-time-deployment',
    key: 'inquiries',
    mode: 'manual',
    manualValue: '100%',
    autoQueryKey: 'inquiry_resolution_rate',
    label: 'ON-TIME DEPLOYMENT',
    subtext: 'Milestone Delivery Rate',
    order: 2,
    isVisible: true,
  },
  {
    id: 'client-partners',
    key: 'clients',
    mode: 'manual',
    manualValue: '+15',
    autoQueryKey: 'client_partners',
    label: 'CLIENT PARTNERS',
    subtext: 'Startups & Enterprises Scaled',
    order: 3,
    isVisible: true,
  },
  {
    id: 'platform-reliability',
    key: 'uptime',
    mode: 'manual',
    manualValue: '99.9%',
    autoQueryKey: 'system_uptime',
    label: 'PLATFORM RELIABILITY',
    subtext: 'Production Uptime Standard',
    order: 4,
    isVisible: true,
  },
];

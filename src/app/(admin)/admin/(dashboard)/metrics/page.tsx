'use client';

import React from 'react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { ProofMetricsManager } from '@/components/admin/ProofMetricsManager';
import { ExternalLink } from 'lucide-react';

export default function AdminMetricsPage() {
  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        items={[
          { label: 'Homepage Content', href: '/admin/homepage' },
          { label: 'Proof & Continuum Metrics' },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Proof & Continuum Metrics
          </h1>
          <p className="text-xs text-slate-400">
            Manage the social proof and business impact stats shown above the perspective grid.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors self-start sm:self-center"
        >
          <span>Preview Live Homepage</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>

      <ProofMetricsManager />
    </div>
  );
}

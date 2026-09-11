import React from 'react';
import DataStore from '@/lib/db/data-store';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function AdminInsightsPage() {
  const insights = await DataStore.getInsights();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Technical Insights & Articles</h1>
          <p className="text-xs text-slate-400">
            Author, publish, and manage architectural essays and thought leadership pieces.
          </p>
        </div>
        <Button size="sm" variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Draft New Essay
        </Button>
      </div>

      <div className="space-y-4">
        {insights.map((item) => (
          <div key={item.slug} className="glass-panel rounded-xl p-6 border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <div className="text-xs font-mono text-slate-400 mt-0.5">
                  Published: {formatDate(item.publishedAt || new Date())} · {item.readTimeMin} min read
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="emerald" size="sm">PUBLISHED</Badge>
                <Button size="sm" variant="secondary" leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
                  Edit
                </Button>
                <Button size="sm" variant="ghost" className="text-[#F43F5E]" leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
                  Delete
                </Button>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {item.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

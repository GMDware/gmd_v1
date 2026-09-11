import React from 'react';
import type { Metadata } from 'next';
import DataStore from '@/lib/db/data-store';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { ArrowUpRight, Clock, BookOpen } from 'lucide-react';
import { formatDate } from '@/lib/utils';

import { resolveActiveTheme } from '@/lib/theme/resolver';
import { NexusInsights } from '@/themes/nexus/components/NexusInsights';
import { AtelierInsights } from '@/themes/atelier/components/AtelierInsights';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return DataStore.getSEO('/insights');
}

export default async function InsightsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const { themeId } = await resolveActiveTheme(resolvedParams);
  const insights = await DataStore.getInsights();

  if (themeId === 'nexus') {
    return <NexusInsights insights={insights} isStandalone={true} />;
  }

  if (themeId === 'atelier') {
    return <AtelierInsights insights={insights} isStandalone={true} />;
  }

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <div className="max-w-3xl space-y-4">
        <Badge variant="cyan">THOUGHT LEADERSHIP & ESSAYS</Badge>
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Architectural Perspectives & Engineering Insights
        </h1>
        <p className="text-base text-slate-400 leading-relaxed font-sans">
          Deep-dives into systems topology, performance engineering, type soundness, and the mathematics behind cinematic digital interfaces.
        </p>
      </div>

      {insights.length === 0 ? (
        <div className="gmd-panel rounded-2xl p-12 sm:p-16 border border-white/10 text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#080D18] border border-white/10 mx-auto flex items-center justify-center text-[#0066FF]">
            <BookOpen className="w-8 h-8 text-[#00D2FF]" />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-xs text-[#00D2FF] uppercase tracking-widest">
              // ESSAYS ARCHIVE: PREPARING RELEASES
            </span>
            <h3 className="text-2xl font-bold text-white font-display">
              Technical Perspectives Under Peer Review
            </h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-md mx-auto font-sans">
              Engineering essays and architectural teardowns are currently being triaged in the CMS. Check back shortly or contact us directly.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {insights.map((article) => (
            <Link key={article.slug} href={`/insights/${article.slug}`} className="block group">
              <Card glow className="p-8 space-y-5 flex flex-col justify-between h-full group-hover:border-[#0066FF]/50 transition-colors">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-[#00D2FF]" />
                      <span>{article.readTimeMin} min read</span>
                    </div>
                    <span className="font-mono text-slate-500">
                      {formatDate(article.publishedAt || new Date())}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#00D2FF] transition-colors leading-snug">
                    {article.title}
                  </h2>

                  <p className="text-sm text-slate-400 leading-relaxed font-sans">
                    {article.summary}
                  </p>

                  {article.tags && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {article.tags.map((tag: string, tIdx: number) => (
                        <Badge key={tIdx} variant="neutral" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5">
                  <span className="text-xs font-mono text-[#00D2FF] inline-flex items-center gap-1 group-hover:underline">
                    <span>Read Full Technical Essay</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

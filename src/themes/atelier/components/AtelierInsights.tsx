'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface AtelierInsightsProps {
  insights?: any[];
  isStandalone?: boolean;
}

export const AtelierInsights: React.FC<AtelierInsightsProps> = ({
  insights = [],
  isStandalone = false,
}) => {
  return (
    <section
      className={`px-6 max-w-6xl mx-auto w-full ${
        isStandalone ? 'pt-8 pb-24' : 'py-20 border-t border-slate-200'
      }`}
      aria-label="Studio Perspectives and Articles"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-slate-200">
        <div className="space-y-3 max-w-2xl">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Perspectives
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 font-sans">
            Thoughts on software engineering and product design.
          </h2>

          <p className="text-base text-slate-600 font-sans leading-relaxed">
            Practical reflections from our team on building reliable digital products, clean data architectures, and maintainable systems.
          </p>
        </div>

        {!isStandalone && (
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900 bg-white/50 hover:bg-slate-900 text-slate-800 hover:text-white font-medium text-xs transition-all duration-200 shadow-sm group active:scale-[0.98] shrink-0"
          >
            <span>Browse all articles</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      {/* Essays Editorial List */}
      <div className="divide-y divide-slate-200">
        {insights.map((item: any, idx: number) => {
          const pubDate = new Date(item.publishedAt || item.createdAt).toLocaleDateString(
            'en-US',
            { month: 'short', day: 'numeric', year: 'numeric' }
          );

          return (
            <article
              key={item.id || idx}
              className="py-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-start group"
            >
              {/* Metadata Left (3 Cols) */}
              <div className="md:col-span-3 space-y-1 text-xs text-slate-500">
                <span className="font-semibold text-slate-900 block">{pubDate}</span>
                <span>{item.readTimeMin || 5} min read</span>
              </div>

              {/* Title & Summary (7 Cols) */}
              <div className="md:col-span-7 space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors font-sans">
                  <Link href={`/insights/${item.slug}`}>
                    {item.title}
                  </Link>
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.summary || item.content?.slice(0, 150)}
                </p>
              </div>

              {/* Action (2 Cols) */}
              <div className="md:col-span-2 md:text-right pt-1">
                <Link
                  href={`/insights/${item.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span>Read article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

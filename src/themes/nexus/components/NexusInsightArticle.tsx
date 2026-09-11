'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Orbit, Share2, ArrowUpRight } from 'lucide-react';

interface NexusInsightArticleProps {
  insight: any;
}

export const NexusInsightArticle: React.FC<NexusInsightArticleProps> = ({ insight }) => {
  return (
    <article className="min-h-screen pt-32 pb-24 px-4 sm:px-8 bg-[#030509] text-slate-100 relative overflow-hidden">
      <div className="max-w-3xl mx-auto space-y-12 relative z-10">
        <Link
          href="/insights"
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO DISPATCH ARCHIVE</span>
        </Link>

        <header className="space-y-6 pb-8 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-[#00F2FE]">
            <Orbit className="w-3 h-3" />
            <span>DISPATCH // {insight.slug?.toUpperCase()}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans leading-tight">
            {insight.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
            <span>By <strong className="text-white">{insight.author?.name || 'GMDware Engineering'}</strong></span>
            <span>•</span>
            <span>{new Date(insight.publishedAt || insight.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span className="text-cyan-300 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {insight.readingTimeMinutes || 5} min read
            </span>
          </div>
        </header>

        {/* Content Prose */}
        <div className="prose prose-invert prose-cyan max-w-none text-slate-300 leading-relaxed font-sans space-y-6">
          {insight.content ? (
            <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
              {insight.content}
            </div>
          ) : (
            <p className="italic text-slate-500">Essay content synchronized directly from CMS data.</p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-12 border-t border-white/10 flex items-center justify-between">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-300 hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Dispatches</span>
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00F2FE] text-black font-bold text-xs shadow-lg shadow-cyan-500/20"
          >
            <span>Discuss This Architecture</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
